const collator = new Intl.Collator("fr", { numeric: true, sensitivity: "base" });

const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;
const DEFAULT_PORTS = { "http:": 80, "https:": 443 };

const parseUrl = (value) => {
  try {
    const { hostname, port, protocol } = new URL(value);
    return {
      host: hostname,
      ip: IPV4.test(hostname) ? hostname.split(".").reduce((acc, octet) => acc * 256 + Number(octet), 0) : null,
      port: Number(port) || DEFAULT_PORTS[protocol] || 0,
    };
  } catch {
    return { host: value, ip: null, port: 0 };
  }
};

// Par adresse IP (dans l'ordre numérique), puis par nom d'hôte, puis par port à hôte égal.
export const compareUrls = (a, b) => {
  const urlA = parseUrl(a);
  const urlB = parseUrl(b);

  if (urlA.ip !== null && urlB.ip !== null) {
    if (urlA.ip !== urlB.ip) return urlA.ip - urlB.ip;
  } else if (urlA.ip !== null || urlB.ip !== null) {
    return urlA.ip !== null ? -1 : 1;
  } else {
    const byHost = collator.compare(urlA.host, urlB.host);
    if (byHost !== 0) return byHost;
  }

  return urlA.port - urlB.port || collator.compare(a, b);
};

const addressKey = (url) => {
  try {
    const { hostname, port, protocol } = new URL(url);
    return `${hostname}:${Number(port) || DEFAULT_PORTS[protocol] || 0}`;
  } catch {
    return null;
  }
};

// Services dont l'URL interne ou externe a le même hôte et le même port. Le chemin n'entre pas en compte.
export const servicesUsingAddress = (url, services) => {
  const key = addressKey(url);
  if (!key) return [];
  return services.filter((service) =>
    [service.internal_url, service.external_url].some((other) => other && addressKey(other) === key)
  );
};

const SORTS = {
  name: { value: (service) => service.name, compare: collator.compare },
  internal_url: { value: (service) => service.internal_url, compare: compareUrls },
  external_url: { value: (service) => service.external_url, compare: compareUrls },
  status: { value: (service) => service.status?.name, compare: collator.compare },
};

// Quel que soit le sens du tri, les services sans valeur restent à la fin de la liste.
export default function sortServices(services, { key, direction }) {
  const sort = SORTS[key];
  if (!sort) return services;

  const sign = direction === "asc" ? 1 : -1;
  return [...services].sort((a, b) => {
    const valueA = sort.value(a);
    const valueB = sort.value(b);
    if (!valueA || !valueB) return Number(!valueA) - Number(!valueB);
    return sign * sort.compare(valueA, valueB);
  });
}

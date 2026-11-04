import toast from "react-hot-toast";

// Les notifications sont réservées aux erreurs. L'identifiant évite d'empiler le même message
// quand plusieurs requêtes échouent ensemble, par exemple si le serveur est injoignable.
export default function notifyErrors(promise, { success, error = (e) => e.message } = {}) {
  return promise.then(success, (e) => {
    const message = error(e);
    toast.error(message, { id: message });
  });
}

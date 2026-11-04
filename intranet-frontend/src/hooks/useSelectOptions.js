import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Charge une liste depuis l'API sous la forme attendue par CustomSelect.
export default function useSelectOptions(fetchItems) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    let isCurrent = true;

    fetchItems()
      .then((response) => {
        if (isCurrent) {
          setOptions(response.data.map((item) => ({ value: item.id, label: item.name })));
        }
      })
      .catch((error) => toast.error(error.message));

    return () => {
      isCurrent = false;
    };
  }, [fetchItems]);

  return options;
}

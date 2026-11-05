import { getAllStatus } from "@/api/modules/status";
import { getAllCategory } from "@/api/modules/category";

import useSelectOptions from "@/hooks/useSelectOptions";
import CustomSelect from "@/Components/Utils/Select";
import InputLabel from "@/Components/Utils/InputLabel";

export default function FilterServices({
  selectedCategories,
  setSelectedCategories,
  selectedStatus,
  setSelectedStatus,
  searchQuery,
  setSearchQuery,
}) {
  const categories = useSelectOptions(getAllCategory);
  const status = useSelectOptions(getAllStatus);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 lg:items-end justify-end">
        <div className="form-control lg:w-56">
          <InputLabel htmlFor="Service" value="Service" />
          <input
            type="text"
            placeholder="Rechercher un service..."
            className="input input-bordered h-12 w-full focus:input-primary"
            id="Service"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
        </div>


        <CustomSelect
          options={status}
          name="Statut"
          placeholder="Tous les statuts"
          selectedOption={selectedStatus}
          setSelectedOption={setSelectedStatus}
          fixedSize
          className="lg:w-64"
        />
        <CustomSelect
          options={categories}
          name="Catégories"
          placeholder="Toutes les catégories"
          selectedOption={selectedCategories}
          setSelectedOption={setSelectedCategories}
          fixedSize
          className="lg:w-64"
        />
      </div>
    </>
  );
}

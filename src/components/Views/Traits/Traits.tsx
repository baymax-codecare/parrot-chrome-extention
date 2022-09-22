import { HyperSpaceAttributes } from "@/chrome/hyperspace";
import { useAppSelector } from "@/stores/hook";
import Select, { StylesConfig } from "react-select";

/**
 * @description Parse trait JSON
 * @param traitsJSON
 */
function parseTraits(traitsData: HyperSpaceAttributes) {
  let traits: string[] = [];
  traitsData.forEach((attr) => attr.values.forEach((v) => traits.push(`${attr.name}:${v}`)));
  return traits;
}

export const NoTraits = () => {
  return (
    <div className="text-teal-800 text-sm">
      Select traits (or no traits) and be notified when a new listing appears
      matching your criteria
    </div>
  );
};

export const Traits = ({
  isShowNoTrait = true,
}: {
  isShowNoTrait?: boolean;
}) => {
  const traitsJSON = useAppSelector((state) => state.chrome.traits);

  if (!traitsJSON) return <>{isShowNoTrait && <NoTraits />}</>;

  const traits = parseTraits(traitsJSON);
  const options = traits.map((trait) => ({ value: trait, label: trait }));

  const customStyles: StylesConfig = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
      border: "none",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: "#004b5f",
        color: "#fff",
      };
    },
    multiValue: (styles, { data }) => {
      return {
        ...styles,
        backgroundColor: "#004b5f",
        padding: "2px",
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: "#fff",
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      display: "none",
    }),
  };

  return (
    <Select
      styles={customStyles}
      isClearable={false}
      components={{
        ClearIndicator: () => null,
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
      }}
      options={options}
      isMulti={true}
      isDisabled={true}
      value={options}
    ></Select>
  );
};

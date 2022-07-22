import { useAppSelector } from "@/stores/hook"
import Select, { StylesConfig } from 'react-select'

/**
 * @description Parse trait JSON
 * @param traitsJSON 
 */
function parseTraits(traitsJSON: string) {

  const traitsData = JSON.parse(traitsJSON);

  let traits: string[] = [];
  for (let key of Object.keys(traitsData)) {
    traits = [
      ...traits,
      ...traitsData[key]
    ]
  }

  return traits;
}

export const NoTraits = () => {
  return <div className="text-teal-800 text-sm">
    Select traits (or no traits) and be notified when a new listing appears matching your criteria
  </div>
}

export const Traits = () => {
  const traitsJSON = useAppSelector((state) => state.chrome.traits)

  if (!traitsJSON) return (<NoTraits />
  )

  const traits = parseTraits(traitsJSON);
  const options = traits.map((trait) => ({ value: trait, label: trait }))

  const customStyles: StylesConfig = {
    control: (styles) => ({ ...styles, backgroundColor: 'white', border: 'none' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: '#004b5f',
        color: "#fff",
      };
    },
    multiValue: (styles, { data }) => {
      return {
        ...styles,
        backgroundColor: "#004b5f",
        padding: "2px"
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: "#fff",
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      display: 'none'
    }),
  };

  return <Select styles={customStyles} isClearable={false} components={{ ClearIndicator: () => null, DropdownIndicator: () => null, IndicatorSeparator: () => null }} options={options} isMulti={true} isDisabled={true} value={options}></Select>
}
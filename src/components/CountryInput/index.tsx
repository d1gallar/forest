import React, { ChangeEvent, Component } from "react";
import countries from "i18n-iso-countries";
import countriesJSON from "i18n-iso-countries/langs/en.json";

countries.registerLocale(countriesJSON);

type CountryInputProps = {
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  selectedCountry: string;
  className?: string;
};

class CountryInput extends Component<CountryInputProps, {}> {
  renderChildren() {
    const countryObj = countries.getNames("en", { select: "official" });
    const countryArr = Object.entries(countryObj).map((key, value) => {
      return { key: value, name: key[1] };
    });
    return countryArr.map(({ key, name }) => {
      return (
        <option key={key} value={name}>
          {name}
        </option>
      );
    });
  }

  render() {
    const { selectedCountry } = this.props;
    const isFirst = selectedCountry === "";
    return (
      <select
        value={selectedCountry}
        onChange={this.props.onChange}
        className={`w-full px-4 py-2 border-2 border-[#c8c8c8] rounded-[7.5px] focus:outline-none focus:border-[#979797] font-Inter text-base font-base tracking-tight appearance-none  ${
          isFirst && "text-[#9ca3af]"
        } ${this.props.className}`}
      >
        <option value="" className="text-[#9ca3af]">
          Select a country
        </option>
        {this.renderChildren()}
      </select>
    );
  }
}
export default CountryInput;

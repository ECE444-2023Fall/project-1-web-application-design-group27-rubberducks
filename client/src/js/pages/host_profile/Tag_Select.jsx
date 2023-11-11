// TagSelect.jsx
import React, { useState, useEffect } from "react";
import Select from "react-select";

//a multiselect component to be used in create event
//with tags fetched from the database
const TagSelect = ({ selectedTags, onTagChange }) => {
  const [tagOptions, setTagOptions] = useState([]);
  useEffect(() => {
    fetch(`/api/events/tags`, {method: "GET"})
    .then((res) => res.json())
    .then((data) => {
      const options = data.map((tag) => ({
        value: tag.etid,
        label: tag.name,
      }));
      setTagOptions(options);
    })
    .catch((error) => {
      console.error('Error fetching tags:', error);
    });
  }, []);

  const handleChange = (selectedOptions) => {
    onTagChange(selectedOptions.map((tag) => tag.value));
  };

  return (
    <Select
      isMulti
      options={tagOptions}
      value={tagOptions.filter((option) => selectedTags.includes(option.value))}
      onChange={handleChange}
    />
  );
};

export default TagSelect;

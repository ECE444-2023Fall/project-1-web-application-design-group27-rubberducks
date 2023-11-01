// TagSelect.jsx
import React, { useState } from 'react';
import Select from 'react-select';

const TagSelect = ({ selectedTags, onTagChange }) => {
  const tagOptions = [
    { value: 'tag1', label: 'Tag 1' },
    { value: 'tag2', label: 'Tag 2' },
    { value: 'tag3', label: 'Tag 3' },
  ];

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

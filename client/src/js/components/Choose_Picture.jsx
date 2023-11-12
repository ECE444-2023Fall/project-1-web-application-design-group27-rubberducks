import React, { useState } from 'react';
import "../../css/components/Choose_Picture.css";

const Choose_Picture = ({ onPictureSelect }) => {
  const [selectedPictureIndex, setSelectedPictureIndex] = useState(0);
  const [showPictures, setShowPictures] = useState(false);
  const eventPictures = [
    '../../../event_pictures/pic1.jpg',
    '../../../event_pictures/pic2.jpg',
    '../../../event_pictures/pic3.jpg',
    '../../../event_pictures/pic4.jpg',
    '../../../event_pictures/pic5.jpg',
    '../../../event_pictures/pic6.jpg',
    '../../../event_pictures/pic7.jpg',
    '../../../event_pictures/pic8.jpg',
    '../../../event_pictures/pic9.jpg',
    '../../../event_pictures/pic10.jpg',
  ];

  const handlePictureClick = (index) => {
    setSelectedPictureIndex(index);
    onPictureSelect(index); 
  };

  return (
    <div>
      {/* <button onClick={() => setShowPictures(!showPictures)}>
        Select Event Picture
      </button>
      {showPictures && ( */}
      <div className="event-pictures">
        {eventPictures.map((picture, index) => (
          <img
            key={index}
            src={picture}
            alt={`Event Picture ${index + 1}`}
            className={selectedPictureIndex === index ? 'selected' : ''}
            onClick={() => handlePictureClick(index)}
          />
        ))}
      </div>
      {/* )} */}
    </div>
  );
};

export default Choose_Picture;

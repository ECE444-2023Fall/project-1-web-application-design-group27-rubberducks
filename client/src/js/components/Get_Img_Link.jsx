export function Get_Profile_Img_Link(pic_index){
    const profilePictures = [
        '../../../profile_pictures/placeholder.png',
        '../../../profile_pictures/img1.jpg',
        '../../../profile_pictures/img2.jpg',
        '../../../profile_pictures/img3.jpg',
        '../../../profile_pictures/img4.jpg',
        '../../../profile_pictures/img5.jpg',
        '../../../profile_pictures/img6.jpg',
        '../../../profile_pictures/img7.jpg',
        '../../../profile_pictures/img8.jpg',
        '../../../profile_pictures/img9.jpg',
        '../../../profile_pictures/img10.jpg',
        '../../../profile_pictures/img11.jpg',
        '../../../profile_pictures/img12.jpg',
      ];
    return profilePictures[pic_index];
}

export function Get_Img_Link(pic_index){
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
    return eventPictures[pic_index];
}

import { Pet } from "../models/models";
import { cloudinary } from "../lib/claudinary";
import { index } from "../lib/algolia";

export async function createPet(name, street, level, city, _geoloc, userId, image) {

    try {
        const imagen = await cloudinary.uploader.upload(image, {
            resource_type: "image",
            discard_original_filename: true,
            width: 1000,
          });
        
          const pet = await Pet.create({
            name,
            street,
            level,
            city,
            lng: _geoloc.lng,
            lat: _geoloc.lat,
            image: imagen.secure_url,
            userId,
          });
        
          const algoliaDuplicate = await index.saveObject({
            objectID: pet.get("id"),
            name,
            street,
            level,
            city,
            _geoloc,
            userId,
            image: imagen.secure_url,
          });
          return "ok"
    } catch (error) {
        return "error"
    }
    
}

export async function updatePet(id, name, street, level, city, _geoloc, userId, image) {
  try {
  const lng = parseFloat(_geoloc.lng);
  const lat = parseFloat(_geoloc.lat);

  const imagen = await cloudinary.uploader.upload(image, {
    resource_type: "image",
    discard_original_filename: true,
    width: 1000,
  });

  const pet = await Pet.update(
    {
      name,
      street,
      level,
      city,
      lng: _geoloc.lng,
      lat: _geoloc.lat,
      image: imagen.secure_url,
      userId,
    },
    {
      where: {
        id,
      },
    }
  );
 
  const algoliaDuplicate = await index.partialUpdateObject({
    objectID: id,
    name,
    street,
    level,
    city,
    _geoloc: { lng: lng, lat: lat },
    userId,
    image: imagen.secure_url,
  });
  return "ok"
  } catch (error) {
    return "error"
  }
}
export async function eliminateOnePet(petId){
  try {
    const eliminate = await Pet.destroy({
      where:{
        id:petId
      }
    })
    const eliminateAlgolia = await index.deleteObject(petId)
    return "ok"
  } catch (error) {
    return error
  }
}

export async function petsByDirection(lat, lng) {
  try {
    const { hits } = await index.search("", {
      aroundLatLng: [lat, lng].join(","),
      aroundRadius: 10000000000,
    });
    return hits
  } catch (error) {
    return "Nothing found"
  }
}

export async function petsByUser(userId) {
  const allPets = await Pet.findAll({
    where: { userId },
  });
  return allPets
}
export const state = {
  data: {
    name: String,
    id: String,
    email: String,
    token: "",
    lng: Number,
    lat: Number,
    map: Map,
  },
  pet: {
    name: String,
    img: Image,
    street: String,
    level: Number,
    city: String,
    lng: Number,
    lat: Number,
  },
  petToReport: {
    userId: Number,
    petName: String,
  },
  getState() {
    return this.data;
  },

  signUp(name: string, password: any, email: string) {
    return fetch("/auth", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.data.name = data.user.name;
        this.data.id = data.user.id;
        this.data.email = data.user.email;
        this.data.token = data.token
        return data;
      });
  },
  signIn(email: string, password: any) {
    return fetch("/auth/token", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Error) {
          return data;
        } else {
          this.data.token = data.token;
          this.data.name = data.user.name;
          this.data.email = data.user.email;
          this.data.id = data.user.user_id;
          return data;
        }
      });
  },
  saveCoordinates(lat: Number, lng: Number) {
    this.data.lat = lat;
    this.data.lng = lng;
    const thisState = state.getState()
    localStorage.setItem("data",JSON.stringify(thisState))
  },
  updateData(name: string, email: string, newpassword: any) {
    return fetch("/user", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer" + `"` + this.data.token + `"`,
      },
      body: JSON.stringify({ name, email,emailToSearch:this.data.email, newpassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.data.name = data[1][0].name
        this.data.email = data[1][0].email  
      });
  },
  getDirectionFromNominatim(direction: string, streetLevel: any, city: string) {
    return fetch(
      "https://nominatim.openstreetmap.org/search?street=" +
        streetLevel +
        " " +
        direction +
        "&city=" +
        city +
        "&format=json"
    )
      .then((response) => response.json())
      .then((data) => {
        const { lat, lon } = data[0];
        return { lat, lon };
      });
  },
  savePetData(
    name: string,
    street: string,
    level: number,
    city: string,
    lng: number,
    lat: number,
    image: string
  ) {
    return fetch("/pet", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer" + `"` + this.data.token + `"`,
      },
      body: JSON.stringify({
        name,
        street,
        level,
        city,
        _geoloc: { lng, lat },
        userId: this.data.id,
        image,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  },
  updatePetData(
    id: number,
    name: string,
    street: string,
    level: number,
    city: string,
    lng: number,
    lat: number,
    image: any
  ) {
    let pictureImage;
    if (image.dataURL) {
      pictureImage = image.dataURL;
    } else {
      pictureImage = image;
    }
    return fetch("/pet", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer" + `"` + this.data.token + `"`,
      },
      body: JSON.stringify({
        id,
        name,
        street,
        level,
        city,
        _geoloc: { lng, lat },
        userId: this.data.id,
        image,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  },
  searchPetsFromAlgolia(lat, lng) {
    return fetch(
      "/pets-near-direction?lat=" + lat + "&lng=" + lng
    )
      .then((res) => res.json())
      .then((results) => {
        return results;
      });
  },
  petsById() {
    return fetch("/pets-by-user?userId=" + this.data.id)
      .then((res) => res.json())
      .then((results) => {
        return results;
      });
  },
  foundPet(username, phone, where) {
    return fetch(
      "/user-by-id?userId=" + this.petToReport.userId
    )
      .then((res) => res.json())
      .then((result) => {
        
        
        
        return fetch("/report-pet", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: "Bearer" + `"` + this.data.token + `"`,
          },
          body: JSON.stringify({
            to: result.email,
            petname: this.petToReport.petName,
            username,
            phone,
            where,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            
            
            return res
          });
      });
  },
};

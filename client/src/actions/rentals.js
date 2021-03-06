import { toast } from 'react-toastify';
import axios from 'axios';
import FormData, {getHeaders} from 'form-data';

export const RENTAL_SET_LOADING_SPINNER = 'RENTAL_SET_LOADING_SPINNER';
export const RENTAL_SEARCH_LISTING_SUCCESS = 'RENTAL_SEARCH_LISTING_SUCCESS';
export const RENTAL_SEARCH_LISTING_FAILURE = 'RENTAL_SEARCH_LISTING_FAILURE';
export const RENTAL_SAVE_SETTINGS_SUCCESS = 'RENTAL_SAVE_SETTINGS_SUCCESS';
export const RENTAL_SAVE_SETTINGS_FAILURE = 'RENTAL_SAVE_SETTINGS_FAILURE';
export const RENTAL_LOAD_SETTINGS_SUCCESS = 'RENTAL_LOAD_SETTINGS_SUCCESS';
export const RENTAL_LOAD_SETTINGS_FAILURE = 'RENTAL_LOAD_SETTINGS_FAILURE';
export const RENTAL_UPDATE_LISTING = "RENTAL_UPDATE_LISTING";

export function rentalSearchListingSuccess(payload) {
  return {
    type: RENTAL_SEARCH_LISTING_SUCCESS,
    payload
  };
}

export function rentalSearchListingFailure() {
  return {
    type: RENTAL_SEARCH_LISTING_FAILURE
  };
}

export function rentalSetLoadingSpinner() {
  return {
    type: RENTAL_SET_LOADING_SPINNER
  };
}

export function rentalSaveSettingsSuccess(payload) {
  return {
    type: RENTAL_SAVE_SETTINGS_SUCCESS,
    payload
  };
}

export function rentalSaveSettingsFailure() {
  return {
    type: RENTAL_SAVE_SETTINGS_FAILURE
  };
}

export function rentalLoadSettingsSuccess(payload) {
  return {
    type: RENTAL_LOAD_SETTINGS_SUCCESS,
    payload
  };
}

export function rentalLoadSettingsFailure() {
  return {
    type: RENTAL_LOAD_SETTINGS_FAILURE
  };
}

export function rentalUpdateListing(payload) {
  return {
    type: RENTAL_UPDATE_LISTING,
    payload
  };
}

export function rentalSearchListing(payload) {
//   let listing = [];

// for (let i = 0; i < 5; i++) {
//   listing.push({
//     id: "" + i,
//     date: "2022-01-03",
//     address: "Barrone LLddsssssssssssssC.",
//     city: "Kalamazoo, MI",
//     state: "Michigan",
//     zipcode: "EIO223",
//     landlord_rent: 1000,
//     landlord_name: "Tom Gray",
//     landlord_contact: "+1 123 3532 3422",
//     airdna_adr: 111,
//     airdna_occupancy: 0.45,
//     beds: 2,
//     baths: 3,
//     square_footage: 400,
//     link: "link" + i
//   });
// }
// return (dispatch) => {
// dispatch(rentalSearchListingSuccess({data: listing, number_of_pages: 2}));
// }
  if (payload.cityState === '') {
    toast.error("City Location is missing", {
      autoClose: 4000,
      closeButton: false,
      hideProgressBar: true,
      position: toast.POSITION.TOP_RIGHT,
    });
  } else {
    return (dispatch) => {
      dispatch(rentalSetLoadingSpinner());

      let baseUrl = `http://localhost:8000/${payload.site === 'Zillow' ? 'zillow' : 'realtor'}/`;

      axios.post(baseUrl, {
        "zip_or_location": payload.cityState,
        "page_index": payload.pageIndex,
        "buy_type": "rent",
        "home_type": payload.homeType,
        "price_min": payload.priceMin,
        "price_max": payload.priceMax,
        "beds": payload.beds,
        "baths": payload.baths
      })
      .then(function (response) {
        let properties = Object.assign([], response.data);
        console.log('properties: ', properties.data);
        
        let asyncHandler = properties.data.map(o => {
          return axios.post(
            'http://localhost:8080/rentals-search-listing',
            {
              path: `https://api.airdna.co/client/v1/rentalizer/ltm?access_token=57a6c8bbdbba43ed95cc0814e7bcda63&address=${o.address}&zipcode=${o.zipcode}&bedrooms=${o.beds}&bathrooms=${o.baths}`
            },
            { 
              headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}
            });
        });

        let data = [];
        Promise.all(asyncHandler).then((values) => {
          properties.data.forEach((o, idx) => {
            data.push({
              ...o,
              ...values[idx].data
            });
          });
          
          console.log('full data: ', data);
        
          dispatch(rentalSearchListingSuccess({
            page_index: properties.page_index,
            number_of_pages: properties.pages,
            data
          }));
        });
      })
      .catch(function (err) {
          toast.error("There is something wrong", {
            autoClose: 4000,
            closeButton: false,
            hideProgressBar: true,
            position: toast.POSITION.TOP_RIGHT,
          });
          dispatch(rentalSearchListingFailure());
      });
    }
  }
}

export function rentalSaveSettings(payload) {
  return (dispatch) => {
    dispatch(rentalSetLoadingSpinner());

    axios.post(
      'http://localhost:8080/rentals-save-settings',
      payload,
      { 
        headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}
      })
    .then(function (response) {
      // toast.success("Settings is saved successfully", {
      //   autoClose: 4000,
      //   closeButton: false,
      //   hideProgressBar: true,
      //   position: toast.POSITION.TOP_RIGHT,
      // });
      dispatch(rentalSaveSettingsSuccess());
    })
    .catch(function (error) {
      toast.error(error.response.data, {
        autoClose: 4000,
        closeButton: false,
        hideProgressBar: true,
        position: toast.POSITION.TOP_RIGHT,
      });
      dispatch(rentalSaveSettingsFailure());
    });
  }
}

export function rentalLoadSettings(payload) {
  return (dispatch) => {
    dispatch(rentalSetLoadingSpinner());

    axios.get(
      'http://localhost:8080/rentals-load-settings',
      { 
        headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}
      })
    .then(function (response) {
      // toast.success("Settings is loaded successfully", {
      //   autoClose: 4000,
      //   closeButton: false,
      //   hideProgressBar: true,
      //   position: toast.POSITION.TOP_RIGHT,
      // });
      dispatch(rentalLoadSettingsSuccess(response.data));
    })
    .catch(function (error) {
      toast.error(error.response.data, {
        autoClose: 4000,
        closeButton: false,
        hideProgressBar: true,
        position: toast.POSITION.TOP_RIGHT,
      });
      dispatch(rentalLoadSettingsFailure());
    });
  }
}
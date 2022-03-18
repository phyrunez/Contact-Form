/** @format */

// ============================CONTACT FORM COMPONENT==============================
// ================================================================================

import "./ContactForm.css";
import { useState, useEffect } from "react";
import { BASE_ENDPOINT } from "./../../env/env";

function ContactForm({ updateContact }) {
  // DECLARE COMPONENT FORM STATES
  const [countries, setCountries] = useState([]);
  const [countryListToggled, setCountryListToggled] = useState(false);
  const [country, setCountry] = useState("");
  const [states, setStates] = useState([]);
  const [stateListToggled, setStateListToggled] = useState(false);
  const [state, setState] = useState("");
  const [cities, setCities] = useState([]);
  const [cityListToggled, setCityListToggled] = useState(false);
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [statusText, setStatusText] = useState("");

  // CLICKS
  const toggleCountryDropdown = () => {
    setStateListToggled(false);
    setCityListToggled(false);
    let countryToggledState = countryListToggled ? false : true;
    setCountryListToggled(countryToggledState);
  };

  const toggleStateDropdown = () => {
    setCountryListToggled(false);
    setCityListToggled(false);
    let stateToggledState = stateListToggled ? false : true;
    setStateListToggled(stateToggledState);
  };

  const toggleCityDropdown = () => {
    setCountryListToggled(false);
    setStateListToggled(false);
    let cityToggledState = cityListToggled ? false : true;
    setCityListToggled(cityToggledState);
  };

  const selectCountry = (country) => {
    setStatus(null);
    setCountry(country);
    setCountryListToggled(false);
    //FETCH COUNTRY AND POPULATE STATE
    let url = BASE_ENDPOINT + "/api/v0.1/countries/states";
    let config = {
      method: "POST",
      body: JSON.stringify({ country: country.name }),
      headers: {
        "content-type": "application/json",
      },
    };
    fetch(url, config)
      .then((res) => res.json())
      .then((res) => {
        if (res.error === false) {
          setState(res.data.states[0]);
          setStates(res.data.states);
        }
      })
      .catch((error) => {
      });
  };

  const selectState = (state) => {
    setStatus(null);
    setState(state);
    setStateListToggled(false);
    //FETCH COUNTRY AND POPULATE STATE
    let url = BASE_ENDPOINT + "/api/v0.1/countries/state/cities";
    let theState = state.name.replace(/state/gi, "").trim();
    let config = {
      method: "POST",
      body: JSON.stringify({ country: country.name, state: theState }),
      headers: {
        "content-type": "application/json",
      },
    };
    fetch(url, config)
      .then((res) => res.json())
      .then((res) => {
        if (res.error === false) {
          setCities(res.data);
          if (res.data.length > 0) setCity(res.data[0]);
        }
      })
      .catch((error) => {
      });
  };

  const selectCity = (city) => {
    setCity(city);
    setCityListToggled(false);
    setStatus(null);
  };

  const showEmailField = (event) => {
    let target;
    if (event.target.classList.contains("email-field-label"))
      target = event.target.parentElement;
    else target = event.target;
    target.children[0].classList.add("shrink-email-text");
    target.children[1].classList.add("show");
    target.children[1].children[0].focus();
    setStatus(null);
  };

  const hideEmailField = (event) => {
    if (email.trim() === "") {
      event.target.parentElement.classList.remove("show");
      event.target.parentElement.parentElement.children[0].classList.remove(
        "shrink-email-text"
      );
    }
  };

  const submitContact = () => {
    if (!email) {
      setStatus(false);
      setStatusText("Email is required");
    } else if (!/^[a-z0-9_]+\@[a-z]+\.[a-z]+$/i.test(email)) {
      setStatus(false);
      setStatusText("Invalid email address");
    } else if (!country) {
      setStatus(false);
      setStatusText("Country is required");
    } else if (!state) {
      setStatus(false);
      setStatusText("State is required");
    } else {
      updateContact({
        email,
        country: country.name,
        state: state.name,
        city: city || null,
      });
      resetForm();
      setStatusText("Contact successfully registered.");
      resetForm();
    }
  };

  const resetForm = () => {
    setEmail("");
    setCountry("");
    setState("");
    setCity("");
    setStatus(true);

    const target = document.getElementsByName("email")[0];
    target.parentElement.classList.remove("show");
    target.parentElement.parentElement.children[0].classList.remove(
      "shrink-email-text"
    );
  };

  // LIFECIRCLE HOOKS
  useEffect(() => {
    //FETCH COUNTRY AND POPULATE STATE
    let url = BASE_ENDPOINT + "/api/v0.1/countries/flag/images";
    let config = {
      method: "GET",
    };
    fetch(url, config)
      .then((res) => res.json())
      .then((res) => {
        if (res.error === false) {
          setCountries(res.data);
        }
      })
      .catch((error) => {
      });
  }, []);

  return (
    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6 row contact-form">
      <div className="col-xs-12 col-sm-12 col-md-11 card p-3 form">
        <header className="w-100 d-flex justify-content-center align-items-center flex-column mt-5">
          <h4>Let's know you more</h4>
          <small>Fill the appropriate details</small>
        </header>
        <section className="mt-3">
          <form style={{ marginTop: '0px', paddingTop: '30px'}}>
            <div
              className="email-field-container form-control"
              onClick={showEmailField}>
              <span className="email-field-label">Email</span>
              <div className="email-field">
                <input
                  type="text"
                  name="email"
                  onBlur={hideEmailField}
                  value={email}
                  className="input"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>
            <div className="dropdown">
              <div
                className="dropdown-toggle form-control"
                onClick={toggleCountryDropdown}>
                {country === "" ? (
                  <div>Country</div>
                ) : (
                  <div className="flag-container">
                    <img
                      src={country.flag}
                      className="flag"
                      alt={country.name + " flag"}
                    />
                  </div>
                )}
              </div>
              <div
                className={`dropdown-menu w-100 ${
                  countryListToggled ? "show" : ""
                }`}>
                {countries.map((country, countryIndex) => {
                  return (
                    <div
                      key={countryIndex}
                      data-value={country.name}
                      onClick={() => selectCountry(country)}
                      className="dropdown-item d-flex">
                      <div className="flag-container">
                        <img
                          src={country.flag}
                          className="flag"
                          alt={country.name + " flag"}
                        />
                      </div>
                      <div className="country d-flex w-100 align-items-center ms-3">
                        {country.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="dropdown">
              <div
                className="dropdown-toggle form-control"
                onClick={toggleStateDropdown}>
                {state === "" ? <div>State</div> : <div>{state.name}</div>}
              </div>
              <div
                className={`dropdown-menu w-100 ${
                  stateListToggled ? "show" : ""
                }`}>
                {states.map((state, stateIndex) => {
                  return (
                    <div
                      key={stateIndex}
                      data-value={state.name}
                      onClick={() => selectState(state)}
                      className="dropdown-item d-flex">
                      <div className="state d-flex w-100 align-items-center ms-3">
                        {state.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="dropdown">
              <div
                className="dropdown-toggle form-control"
                onClick={toggleCityDropdown}>
                {city === "" ? <div>City/Town</div> : <div>{city}</div>}
              </div>
              <div
                className={`dropdown-menu w-100 ${
                  cityListToggled ? "show" : ""
                }`}>
                {cities.map((city, cityIndex) => {
                  return (
                    <div
                      key={cityIndex}
                      data-value={city.name}
                      onClick={() => selectCity(city)}
                      className="dropdown-item d-flex">
                      <div className="city d-flex w-100 align-items-center ms-3">
                        {city}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              type="button"
              className="btn submit-button w-100"
              onClick={submitContact}>
              Submit
            </button>
            {status !== null ? (
              <div
                className={
                  status
                    ? "alert alert-success mt-3"
                    : "alert alert-danger mt-3"
                }>
                {statusText}
              </div>
            ) : (
              ""
            )}
          </form>
        </section>
      </div>
    </div>
  );
}

export default ContactForm;

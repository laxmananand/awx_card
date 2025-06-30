import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getTheme } from "../../../../data/branding/themes";
import AIQuestion from "./QuestionsModal/AIQuestion";
import { handleCopy } from "../../../structure/handleCopy";
import { useDispatch, useSelector } from "react-redux";
import {
  brandingUpload,
  getbrandingDetails,
} from "../../../../@redux/action/settings.js";
import { toast } from "react-toastify";
import { FadeLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";

function Theme({ setColour, setFont }) {
  const navigate = useNavigate();

  const [count, setCount] = useState(0);

  const [aiColorSet, setAIColorSet] = useState([]);

  const [randomColor, setRandomColor] = useState("#000000"); // Initial color is black

  const [currentColor, setCurrentColor] = useState("");

  const [currentFont, setCurrentFont] = useState("");

  const brandingData = useSelector((state) => state.settings.branding);

  const [answers, setAnswers] = useState({});

  const [isGenerated, setIsGenerated] = useState(false);

  const [loader, setLoader] = useState("Generate");

  const [loading, setLoading] = useState(false);

  const [additionalShow, setAddtionalShow] = useState(false);

  const dispatch = useDispatch();

  const subStatus = useSelector((state) => state.subscription?.data?.status);
  const complianceStatus =
    useSelector(
      (state) => state.onboarding?.CustomerDetailsNIUM?.complianceStatus
    ) || "";

  const hexToHSL = (hex) => {
    // Remove the leading # if present
    hex = hex.replace(/^#/, "");

    // Convert the hex to RGB
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    // Find the minimum and maximum values among r, g, b
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);

    // Calculate Lightness
    let l = (max + min) / 2;

    // Calculate Saturation
    let s;
    if (max === min) {
      s = 0;
    } else {
      s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2.0 - max - min);
    }

    // Calculate Hue
    let h;
    if (max === r) {
      h = (g - b) / (max - min);
    } else if (max === g) {
      h = 2.0 + (b - r) / (max - min);
    } else {
      h = 4.0 + (r - g) / (max - min);
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    // Convert results to percentage form
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return { h, s, l };
  };

  function hslToHex(hue, sat, light) {
    let h = Number(hue);
    let s = Number(sat?.slice(0, sat?.length - 1));
    let l = Number(light?.slice(0, light?.length - 1));

    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  const setDefault = () => {
    localStorage.removeItem("style");
    setRandomColor({
      main: "#3b656b",
      primary: "#0b8fb9",
      secondary: "#299e58",
      tertiary: "#f0b429",
      primaryB: "rgba(169, 192, 209, 0.1)",
      secondaryB: "rgba(41, 158, 88, 0.1)",
      tertiaryB: "rgba(240, 180, 41, 0.1)",
      color0: "#ffffff",
      color25: "#e7ebef",
      color50: "rgba(219, 229, 230, 0.2)",
      color75: "#8f9096",
      color100: "#0a1e2c",
      brand: "206",
      brand_L: "74%",
      brand_S: "30%",
      button: "#FFF62D",
    });
    changeColor({
      main: "#3b656b",
      primary: "#0b8fb9",
      secondary: "#299e58",
      tertiary: "#f0b429",
      primaryB: "rgba(169, 192, 209, 0.1)",
      secondaryB: "rgba(41, 158, 88, 0.1)",
      tertiaryB: "rgba(240, 180, 41, 0.1)",
      color0: "#ffffff",
      color25: "#e7ebef",
      color50: "rgba(219, 229, 230, 0.2)",
      color75: "#8f9096",
      color100: "#0a1e2c",
      brand: "206",
      brand_L: "74%",
      brand_S: "30%",
      button: "#FFF62D",
    });
  };

  useEffect(() => {
    if (currentFont) setFont(currentFont);
  }, [currentFont]);

  useEffect(() => {
    if (isGenerated) setAIColorSet(getTheme(answers));
  }, [answers, isGenerated]);

  useEffect(() => {
    // rootStyles?.setProperty('--color-25', colour?.color25); // Modify the value of a CSS variable
    const root = document.documentElement;

    const main = getComputedStyle(root).getPropertyValue("--main-color");
    const primary = getComputedStyle(root).getPropertyValue(
      "--primary-color-100"
    );
    const primaryB =
      getComputedStyle(root).getPropertyValue("--primary-color-10");
    const secondary = getComputedStyle(root).getPropertyValue(
      "--secondary-color-100"
    );
    const secondaryB = getComputedStyle(root).getPropertyValue(
      "--secondary-color-10"
    );
    const tertiary = getComputedStyle(root).getPropertyValue(
      "--tertiary-color-100"
    );
    const tertiaryB = getComputedStyle(root).getPropertyValue(
      "--tertiary-color-10"
    );
    const color0 = getComputedStyle(root).getPropertyValue("--color-0");
    const color25 = getComputedStyle(root).getPropertyValue("--color-25");
    const color50 = getComputedStyle(root).getPropertyValue("--color-50");
    const color75 = getComputedStyle(root).getPropertyValue("--color-75");
    const color100 = getComputedStyle(root).getPropertyValue("--color-100");
    const brand = getComputedStyle(root).getPropertyValue("--primary");
    const brand_S = getComputedStyle(root).getPropertyValue("--primary-s");
    const brand_L = getComputedStyle(root).getPropertyValue("--primary-l");
    const button = getComputedStyle(root).getPropertyValue("--button");

    setRandomColor({
      main,
      primary,
      secondary,
      tertiary,
      primaryB,
      secondaryB,
      tertiaryB,
      color0,
      color25,
      color50,
      color75,
      color100,
      brand,
      brand_L,
      brand_S,
      button,
    });
  }, []);

  const changeColor = (colour) => {
    // const root = document.documentElement;
    const rootStyles = root?.style;
    if (colour?.main) rootStyles?.setProperty("--main-color", colour?.main); // Modify the value of a CSS variable
    if (colour?.primary)
      rootStyles?.setProperty("--primary-color-100", colour?.primary); // Modify the value of a CSS variable
    if (colour?.primaryB)
      rootStyles?.setProperty("--primary-color-10", colour?.primaryB); // Modify the value of a CSS variable
    if (colour?.secondary)
      rootStyles?.setProperty("--secondary-color-100", colour?.secondary); // Modify the value of a CSS variable
    if (colour?.secondaryB)
      rootStyles?.setProperty("--secondary-color-10", colour?.secondaryB); // Modify the value of a CSS variable
    if (colour?.tertiary)
      rootStyles?.setProperty("--tertiary-color-100", colour?.tertiary); // Modify the value of a CSS variable
    if (colour?.tertiaryB)
      rootStyles?.setProperty("--tertiary-color-10", colour?.tertiaryB); // Modify the value of a CSS variable
    if (colour?.color0) rootStyles?.setProperty("--color-0", colour?.color0); // Modify the value of a CSS variable
    if (colour?.color25) rootStyles?.setProperty("--color-25", colour?.color25); // Modify the value of a CSS variable
    if (colour?.color50) rootStyles?.setProperty("--color-50", colour?.color50); // Modify the value of a CSS variable
    if (colour?.color75) rootStyles?.setProperty("--color-75", colour?.color75); // Modify the value of a CSS variable
    if (colour?.color100)
      rootStyles?.setProperty("--color-100", colour?.color100); // Modify the value of a CSS variable
    if (colour?.brand !== undefined)
      rootStyles?.setProperty("--primary", colour?.brand); // Modify the value of a CSS variable
    if (colour?.brand_S)
      rootStyles?.setProperty("--primary-s", colour?.brand_S); // Modify the value of a CSS variable
    if (colour?.brand_L)
      rootStyles?.setProperty("--primary-l", colour?.brand_L); // Modify the value of a CSS variable
    if (colour?.button) rootStyles?.setProperty("--yellow", colour?.button); // Modify the value of a CSS variable
  };

  const onSave = async () => {
    if (
      complianceStatus.toLowerCase() === "completed" &&
      (subStatus?.toLowerCase() === "inactive" ||
        subStatus === "sub01" ||
        subStatus === "sub02" ||
        subStatus?.toLowerCase() === "canceled")
    ) {
      navigate("/settings/subscription");
      // toast.error("Kindly take subscription before applying for custom domain.")
      return;
    } else {
      if (randomColor) {
        // setLoading(true)
        // const data = await
        dispatch(brandingUpload({ randomColor: randomColor }));

        // if (data && (data?.message == "updated succesfully" || data?.message == "saved succesfully")) {
        //     localStorage.setItem("style", JSON.stringify(randomColor));
        //     changeColor(randomColor);
        //     toast.success("Color " + data?.message + "!");
        //     setLoading(false)
        // }
        // else {
        //     toast.error(data?.message);
        //     setLoading(false)
        // }
      } else {
        toast.error("Kindly choose colors prior to proceeding.");
      }
    }
  };

  const onFontSave = async () => {
    const rootStyles = document.documentElement?.style;
    if (currentFont) {
      setLoading(true);
      const data = await dispatch(brandingUpload({ currentFont: currentFont }));
      if (
        data &&
        (data?.message == "updated successfully" ||
          data?.message == "saved successfully")
      ) {
        rootStyles?.setProperty("--font", currentFont);
        setRandomColor({ ...randomColor, "--font": currentFont });
        localStorage.setItem(
          "style",
          JSON.stringify({ ...randomColor, font: currentFont })
        );
        toast.success("Font " + data?.message + "!");
        setLoading(false);
      } else {
        toast.error(data?.message);
        setLoading(false);
      }
    } else {
      toast.error("Kindly select a font prior to proceeding.");
    }
  };

  const colors = [
    { label: "Choose Color", value: "" },
    { label: "Brand Color", value: "brand" },
    { label: "Button Color", value: "button" },
    // { label: "Primary Color", value: "primary" },
    // { label: "Secondary Color", value: "secondary" },
    // { label: "Tertiary Color", value: "tertiary" },
    // { label: "Primary Color Background", value: "primaryB" },
    // { label: "Secondary Color Background", value: "secondaryB" },
    // { label: "Tertiary Color Background", value: "tertiaryB" },
    { label: "Background Color", value: "color0" },
    // { label: "Color 1", value: "color25" },
    // { label: "Color 2", value: "color50" },
    // { label: "Color 3", value: "color75" },
    { label: "Text Color", value: "color100" },
  ];

  // fonts list
  const fonts = [
    { label: "Choose Font", value: "" },
    { label: "Andale Mono", value: "Andale Mono, monospace" },
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Arial Black", value: "Arial Black, sans-serif" },
    { label: "Arial Narrow", value: "Arial Narrow, sans-serif" },
    {
      label: "Arial Rounded MT Bold",
      value: "Arial Rounded MT Bold, sans-serif",
    },
    { label: "Avant Garde", value: "Avant Garde, sans-serif" },
    { label: "Baskerville", value: "Baskerville, serif" },
    { label: "Bookman", value: "Bookman, serif" },
    { label: "Brush Script MT", value: "Brush Script MT, cursive" },
    { label: "Brush Script Std", value: "Brush Script Std, cursive" },
    { label: "Century Gothic", value: "Century Gothic, sans-serif" },
    { label: "Comic Sans MS", value: "Comic Sans MS, cursive" },
    { label: "Consolas", value: "Consolas, monospace" },
    { label: "Courier", value: "Courier, monospace" },
    { label: "Courier New", value: "Courier New, monospace" },
    { label: "Copperplate", value: "Copperplate, sans-serif" },
    { label: "Cursive", value: "cursive" },
    { label: "Didot", value: "Didot, serif" },
    { label: "Fantasy", value: "fantasy" },
    {
      label: "Franklin Gothic Book",
      value: "Franklin Gothic Book, sans-serif",
    },
    {
      label: "Franklin Gothic Medium",
      value: "Franklin Gothic Medium, sans-serif",
    },
    { label: "Futura", value: "Futura, sans-serif" },
    { label: "Garamond", value: "Garamond, serif" },
    { label: "Geneva", value: "Geneva, sans-serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Gill Sans", value: "Gill Sans, sans-serif" },
    { label: "Helvetica", value: "Helvetica, sans-serif" },
    { label: "Helvetica Neue", value: "Helvetica Neue, sans-serif" },
    { label: "Impact", value: "Impact, fantasy" },
    { label: "Libre Franklin", value: "'Libre Franklin', sans-serif" },
    { label: "Lucida Grande", value: "Lucida Grande, sans-serif" },
    { label: "Lucida Sans Unicode", value: "Lucida Sans Unicode, sans-serif" },
    { label: "Maven Pro", value: "'Maven Pro', sans-serif" },
    { label: "Montserrat", value: "'Montserrat', sans-serif" },
    { label: "Myriad", value: "Myriad, sans-serif" },
    { label: "Optima", value: "Optima, sans-serif" },
    { label: "Palatino", value: "Palatino, serif" },
    { label: "Playfair Display", value: "'Playfair Display', serif" },
    { label: "Roboto", value: "'Roboto', sans-serif" },
    { label: "Rockwell", value: "Rockwell, serif" },
    { label: "Tahoma", value: "Tahoma, sans-serif" },
    { label: "Times New Roman", value: "Times New Roman, serif" },
    { label: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
    { label: "Verdana", value: "Verdana, sans-serif" },
  ];

  const generateRandomColor = () => {
    // const randomColorCode = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    // setRandomColor({ ...randomColor, main: randomColorCode });
    setCount(count + 1);
    setTimeout(() => setLoader("Generating"), 100);
    setTimeout(() => setLoader("Generating."), 200);
    setTimeout(() => setLoader("Generating.."), 300);
    setTimeout(() => setLoader("Generating..."), 400);
    setTimeout(() => setLoader("Generating"), 500);
    setTimeout(() => setLoader("Generating."), 600);
    setTimeout(() => setLoader("Generating.."), 700);
    setTimeout(() => setLoader("Generating..."), 800);
    setTimeout(() => setLoader("Generating"), 900);
    setTimeout(() => setLoader("Generate"), 1000);
    setTimeout(
      () => setRandomColor(aiColorSet[count % aiColorSet?.length]),
      1000
    );
  };

  useEffect(() => {
    setColour(randomColor);
  }, [randomColor]);

  return (
    <div className="overflow-auto" style={{ height: "60vh" }}>
      {loading && (
        <div className="loader-overlaySettings">
          <div className="loader-containerSettings">
            <FadeLoader
              color={"var(--main-color)"}
              loading={loading}
              size={50}
            />
          </div>
        </div>
      )}
      <div className="rounded-5 shadow p-3 m-3">
        <p>Let AI generate your theme</p>
        <div className="d-flex flex-column">
          {/* <button onClick={generateRandomColor} className='btn btn-action fw-500 ms-auto mt-3 w-100' disabled>Coming soon</button> */}
          {isGenerated ? (
            <button
              onClick={generateRandomColor}
              className="btn btn-action fw-500 ms-auto mt-3 w-100"
            >
              {loader}
            </button>
          ) : (
            <AIQuestion
              setAnswers={setAnswers}
              setIsGenerated={setIsGenerated}
            />
          )}
        </div>
      </div>

      <div className="rounded-5 shadow p-3 m-3">
        <p>Choose your brand color</p>
        <input
          type="color"
          onChange={(e) => {
            const { h, s, l } = hexToHSL(e.target.value);
            setRandomColor({
              ...randomColor,
              brand: h,
              brand_S: s + "%",
              brand_L: l + "%",
            });
          }}
          className="w-100"
          value={hslToHex(
            randomColor["brand"],
            randomColor["brand_S"],
            randomColor["brand_L"]
          )}
        />
      </div>
      <button
        onClick={() => setAddtionalShow((prev) => !prev)}
        className="btn ms-auto p-l-m text-end me-3 px-3 color-green-50"
      >
        {additionalShow ? "Hide" : "Show"} advance customization
      </button>

      {additionalShow && (
        <div className="rounded-5 shadow p-3 m-3">
          <p>Customize your own color</p>
          <select
            className="w-100 mb-3 fw-500 p-2"
            onChange={(e) => setCurrentColor(e.target.value)}
          >
            {colors.map((color, key) => (
              <option value={color?.value} key={key}>
                {color?.label}
              </option>
            ))}
          </select>

          {currentColor === "brand" && (
            <div className="">
              <div
                className="w-100 border"
                style={{
                  backgroundColor: `hsl(${randomColor[currentColor]}, 100%, 64%)`,
                  height: "20px",
                }}
              ></div>
              <input
                className="w-100"
                type="range"
                min={0}
                max={360}
                value={randomColor[currentColor]}
                onChange={(e) =>
                  setRandomColor({
                    ...randomColor,
                    [currentColor]: e.target.value,
                  })
                }
              />
            </div>
          )}

          {currentColor !== "brand" &&
            currentColor &&
            (currentColor !== "secondary" ? (
              <>
                <input
                  type="color"
                  onChange={(e) =>
                    setRandomColor({
                      ...randomColor,
                      [currentColor]: e.target.value,
                    })
                  }
                  className="w-100"
                  value={randomColor[currentColor]}
                />
                <button
                  onClick={onSave}
                  className="btn btn-action fw-500 w-100 mt-3"
                >
                  Save Theme
                </button>
              </>
            ) : (
              <>
                <div className="d-flex">
                  <input
                    type="color"
                    onChange={(e) =>
                      setRandomColor({
                        ...randomColor,
                        primary: e.target.value,
                        primaryB: e.target.value + "10",
                      })
                    }
                    className="w-100"
                    value={randomColor["primary"]}
                  />
                  <input
                    type="color"
                    onChange={(e) =>
                      setRandomColor({
                        ...randomColor,
                        secondary: e.target.value,
                        secondaryB: e.target.value + "10",
                      })
                    }
                    className="w-100"
                    value={randomColor["secondary"]}
                  />
                  <input
                    type="color"
                    onChange={(e) =>
                      setRandomColor({
                        ...randomColor,
                        tertiary: e.target.value,
                        tertiaryB: e.target.value + "10",
                      })
                    }
                    className="w-100"
                    value={randomColor["tertiary"]}
                  />
                </div>
                <button
                  onClick={onSave}
                  className="btn btn-action fw-500 w-100 mt-3"
                >
                  Save Theme
                </button>
              </>
            ))}
        </div>
      )}

      {additionalShow && (
        <div className="rounded-5 shadow p-3 m-3">
          <p>Choose your font</p>
          <select
            className="w-100 mb-3 fw-500 p-2"
            style={{ fontFamily: currentFont }}
            onChange={(e) => setCurrentFont(e.target.value)}
          >
            {fonts.map((font, key) => (
              <option
                style={{ fontFamily: font?.value }}
                value={font?.value}
                key={key}
              >
                {font?.label}
              </option>
            ))}
          </select>

          {currentFont && (
            <>
              <button
                onClick={onFontSave}
                className="btn btn-action fw-500 w-100 mt-3"
              >
                Save Font
              </button>
            </>
          )}
        </div>
      )}

      <div className="p-3 m-3">
        <button onClick={onSave} className="btn btn-action fw-500 w-100">
          Save Theme
        </button>
        <button
          onClick={setDefault}
          className="btn btn-action fw-500 w-100 mt-3"
        >
          Reset to default
        </button>
      </div>
    </div>
  );
}

export default Theme;

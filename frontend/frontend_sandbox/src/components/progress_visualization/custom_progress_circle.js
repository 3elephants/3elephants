import React from "react";
import { render } from "react-dom";
import CircularProgressbar from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import OneElephantRating from "one_elephant_rating";
import "./index.css";

function CustomContentProgressbar(props) {
  const { children, ...otherProps } = props;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%"
      }}
    >
      <div style={{ position: "absolute" }}>
        <CircularProgressbar {...otherProps} />
      </div>
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {props.children}
      </div>
    </div>
  );
}

function ElephantsProgressCircle(props) {

  return (
    <div
      style={{
        width: "200px",
        height: "200px"
      }}
    >
      <CustomContentProgressbar percentage={props.percentage}>
        <div>
          <OneElephantRating score={props.percentage}/>
        </div>
        <div>
          <strong>{percentage}%</strong>
        </div>
      </CustomContentProgressbar>
    </div>
  );
}

export default ElephantsProgressCircle;

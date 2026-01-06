"use client";

import React from "react";
import "./AppDownload.css";
import { assets } from "@/src/assets/assets";

const AppDownload = () => {
  return (
    <div className="app-download" id="app-download">
      <p>
        For Better Experience Download <br /> Tomato App
      </p>
      <div className="app-download-platforms">
        <img src={assets.play_store} alt="app store" />
        <img src={assets.app_store} alt="play store" />
      </div>
    </div>
  );
};

export default AppDownload;

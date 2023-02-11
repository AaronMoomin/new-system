/**
 * @Author: Aaron
 * @Date: 2022/7/20
 */
// @ts-nocheck
import React from 'react';
import Particles from "react-tsparticles";
import { loadBigCirclesPreset } from "tsparticles-preset-big-circles";

export default function MyParticles() {

    const customInit = async (engine: any): Promise<void> => {

        await loadBigCirclesPreset(engine);
    }
    const options = {
        preset: "big-circles",
    };

    return (
        <Particles options={options} init={customInit}/>
    );
}

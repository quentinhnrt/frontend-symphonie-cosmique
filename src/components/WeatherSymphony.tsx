import {useEffect, useState} from "react";
import {useSelectedPlanet} from "../contexts/SelectedPlanetContext.tsx";
import {MusicComposer} from "../lib/MusicComposer.ts";
import usePlanetData from "../hooks/usePlanetData.ts";
import * as Tone from 'tone'
import useWeather from "../hooks/useWeather.ts";

export default function WeatherSymphony() {
    const [selectedPlanet] = useSelectedPlanet();
    const { data: planetData} = usePlanetData(selectedPlanet?.name);
    const { data: earthData } = usePlanetData('Earth');
    const [composer, setComposer] = useState<MusicComposer | null>(null);
    const [latLong, setLatLong] = useState<[number, number] | [null, null]>([null, null]);
    const {data: weather} = useWeather(latLong[0], latLong[1]);
    useEffect(() => {
        if (!selectedPlanet && composer) {
            composer.stopMusic();
            return;
        }

        if (earthData) {
            Tone.getTransport().cancel();
            setComposer(new MusicComposer(earthData));
        }

        if (!selectedPlanet || !composer) return;

        if (selectedPlanet.name === 'Earth') {
            composer.stopMusic();
            composer.setPlanet(planetData.name, earthData, weather);
            composer.playMusic();
            return;
        }

        composer.stopMusic();
        composer.setPlanet(selectedPlanet.name, planetData);
        composer.playMusic();
    }, [selectedPlanet, planetData, earthData])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLatLong([position.coords.latitude, position.coords.longitude]);
        })
    }, [])

    return (
        <>
        </>
    );
}
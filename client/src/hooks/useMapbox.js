import { useRef } from "react";
import { useListPanel } from "../appReducer";
import useBreakpoints from "./useBreakpoints";
import { useMap } from "react-map-gl";

export const useMapbox = () => {
  const mapRef = useRef();
  const isListPanelOpen = useListPanel();
  const { isMobile } = useBreakpoints();
  const mapbox = useMap();

  const getViewport = () => {
    const map = mapbox.default.getMap();

    const { lat: latitude, lng: longitude } = map.getCenter();
    const zoom = map.getZoom();
    const { width, height } = map.getContainer().getBoundingClientRect();

    return {
      center: { latitude, longitude },
      zoom,
      dimensions: { width, height },
    };
  };

  const flyTo = ({ latitude, longitude }) => {
    if (!mapbox.default) {
      return;
    }
    mapbox.default.flyTo({
      center: [
        isListPanelOpen && !isMobile ? longitude - 0.08 : longitude,
        isMobile ? latitude - 0.05 : latitude,
      ],
      duration: 2000,
    });
  };

  return { mapRef, getViewport, flyTo };
};

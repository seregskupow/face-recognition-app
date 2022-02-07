import { FC } from 'react';
import styles from './googleMap.module.scss';
import GoogleMapReact from 'google-map-react';
import { useActions } from '@/store/useActions';
import { mapStyles } from './mapStyles';
import { FaMapMarkerAlt } from 'react-icons/fa';
const defaultProps = {
  center: {
    lat: 59.95,
    lng: 30.33
  },
  zoom: 11
};
interface GoogleMapProps {
  address: string;
}
const GoogleMap: FC<GoogleMapProps> = ({ address }) => {
  const { setMessage } = useActions();
  console.log({ address });
  const onGoogleApiLoadedHandler = (
    map: google.maps.Map,
    maps: typeof google.maps
  ) => {
    map.setOptions({
      styles: mapStyles
    });
    // const geocoder = new maps.Geocoder();
    // geocoder
    //   .geocode({ address: address })
    //   .then((result) => {
    //     const { results } = result;
    //     map.setCenter(results[0].geometry.location);
    //   })
    //   .catch((e) => {
    //     setMessage({ msg: e.message, type: 'error' });
    //   });
  };

  const renderMap = () => {
    if (!address || address === 'unavailable') {
      return (
        <div className={styles.MapPlaceholder}>
          <div className={styles.icon}>
            <FaMapMarkerAlt />
          </div>
          <h2 className={styles.placeholderTitle}>Address is unavailable</h2>
        </div>
      );
    }
    return (
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.REACT_APP_GOOGLE_KEY as string
        }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => {
          onGoogleApiLoadedHandler(map, maps);
        }}
      ></GoogleMapReact>
    );
  };
  return <div className={styles.MapWrapper}>{renderMap()}</div>;
};
export default GoogleMap;

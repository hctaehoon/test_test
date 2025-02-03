import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const MapContainer = styled.div`
  width: 90%;
  height: 70vh;
  border-radius: 30px;
  box-shadow: 0 10px 20px rgba(255, 107, 107, 0.1);
  overflow: hidden;
  position: relative;
  margin: 0 auto;
  border: 3px solid #ffeded;
`;

const AddLocationForm = styled.form`
  width: 90%;
  margin: 20px auto;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  padding: 12px 20px;
  border: 2px solid #ffeded;
  border-radius: 25px;
  font-size: 16px;
  width: 200px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #ff6b6b;
    box-shadow: 0 0 10px rgba(255, 107, 107, 0.2);
  }
`;

const Button = styled.button`
  padding: 12px 25px;
  background: linear-gradient(45deg, #ff6b6b, #ffa3a3);
  border: none;
  border-radius: 25px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
  }
`;

const LocationList = styled.div`
  width: 90%;
  margin: 20px auto;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

const LocationTag = styled.div`
  padding: 8px 15px;
  background: #ffeded;
  border-radius: 20px;
  font-size: 14px;
  color: #ff6b6b;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ff6b6b;
    color: white;
  }
`;

// 여행 데이터
const initialLocations = [
  { title: '오이도', lat: 37.34639692396398, lng: 126.68819399072788 },
  { title: '대부도', lat: 37.24750976584791, lng: 126.59617920264822 },
  { title: '고잔역', lat: 37.31649883265228, lng: 126.82228397630698 },
  { title: '수원역', lat: 37.268489805692255, lng: 127.00234504331648 },
  { title: '수원 스타필드', lat: 37.28834843633487, lng: 126.99138421236204 },
  { title: '평창 발왕산케이블카', lat: 37.615148, lng: 128.322164 },
  { title: '강릉', lat: 37.7519, lng: 128.8760 },
  { title: '망포역', lat: 37.2456, lng: 127.0574 },
  { title: '동탄', lat: 37.2001, lng: 127.0968 },
  { title: '광명동굴', lat: 37.42701624392685, lng: 126.86482823517368 },
  { title: '영등포역', lat: 37.5156, lng: 126.9075 },
  { title: '반달섬', lat: 37.303036694954024, lng: 126.75179697072944 },
  { title: '배곧', lat: 37.3682, lng: 126.7256 },
  { title: '하우스봉봉', lat: 37.70957617458109, lng: 128.69481552347122 },
  { title: '거북섬', lat: 37.321901358979446, lng: 126.68268798038005 }
];

function TravelMap() {
  const mapRef = useRef(null);
  const [locations, setLocations] = useState(initialLocations);
  const [newLocation, setNewLocation] = useState({ title: '', lat: '', lng: '' });
  const [map, setMap] = useState(null);

  // 카카오맵 초기화
  useEffect(() => {
    const loadKakaoMapScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=1f23140babf1d42f8981290c6a2052f2&autoload=false`;
        script.onload = () => {
          window.kakao.maps.load(resolve);
        };
        document.head.appendChild(script);
      });
    };

    const initializeMap = () => {
      const options = {
        center: new window.kakao.maps.LatLng(37.5, 127.5),
        level: 14
      };

      const mapInstance = new window.kakao.maps.Map(mapRef.current, options);
      setMap(mapInstance);
    };

    const init = async () => {
      try {
        if (!window.kakao?.maps) {
          await loadKakaoMapScript();
        }
        initializeMap();
      } catch (error) {
        console.error('카카오맵 초기화 실패:', error);
      }
    };

    init();

    return () => {
      const script = document.querySelector('script[src*="dapi.kakao.com"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 마커 생성 및 업데이트
  useEffect(() => {
    if (!map) return;

    // 기존 오버레이 제거
    const overlays = document.querySelectorAll('.custom-overlay');
    overlays.forEach(overlay => overlay.remove());

    // 모든 위치를 포함하는 bounds 생성
    const bounds = new window.kakao.maps.LatLngBounds();

    locations.forEach(location => {
      const position = new window.kakao.maps.LatLng(location.lat, location.lng);
      bounds.extend(position);
      
      const content = document.createElement('div');
      content.className = 'custom-overlay';
      content.innerHTML = `
        <div style="
          padding: 5px;
          font-size: 24px;
          cursor: pointer;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
          position: relative;
        ">
          <div class="heart-marker" style="
            transition: transform 0.3s ease;
          ">❤️</div>
          <div class="location-name" style="
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(255, 107, 107, 0.9);
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 14px;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 1;
          ">${location.title}</div>
        </div>
      `;

      // eslint-disable-next-line no-unused-vars
      const overlay = new window.kakao.maps.CustomOverlay({
        position: position,
        content: content,
        map: map,
        yAnchor: 1
      });

      const heartMarker = content.querySelector('.heart-marker');
      const locationName = content.querySelector('.location-name');

      content.addEventListener('mouseover', () => {
        heartMarker.style.transform = 'scale(1.2)';
        locationName.style.opacity = '1';
      });

      content.addEventListener('mouseout', () => {
        heartMarker.style.transform = 'scale(1)';
        locationName.style.opacity = '0';
      });
    });

    // 모든 마커가 보이도록 지도 범위 조정
    map.setBounds(bounds);
  }, [locations, map]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newLocation.title && newLocation.lat && newLocation.lng) {
      setLocations([...locations, newLocation]);
      setNewLocation({ title: '', lat: '', lng: '' });
    }
  };

  return (
    <>
      <MapContainer ref={mapRef} />
      <AddLocationForm onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="장소 이름"
          value={newLocation.title}
          onChange={(e) => setNewLocation({ ...newLocation, title: e.target.value })}
        />
        <Input
          type="number"
          placeholder="위도"
          value={newLocation.lat}
          onChange={(e) => setNewLocation({ ...newLocation, lat: parseFloat(e.target.value) })}
        />
        <Input
          type="number"
          placeholder="경도"
          value={newLocation.lng}
          onChange={(e) => setNewLocation({ ...newLocation, lng: parseFloat(e.target.value) })}
        />
        <Button type="submit">추가하기 💝</Button>
      </AddLocationForm>
      <LocationList>
        {locations.map((location, index) => (
          <LocationTag key={index}>
            ❤️ {location.title}
          </LocationTag>
        ))}
      </LocationList>
    </>
  );
}

export default TravelMap; 
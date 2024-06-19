import React from 'react';
import NavBar from '../components/NavBar';
import MainHero from '../components/MainHero';
import MainHeroImage from '../components/MainHeroImage';
import { Col, Row } from 'antd';

const Home = () => {
    return (
        <div>
            <div>
                <div>
                <MainHero/>
                </div>
                <div>
                    <MainHeroImage/>
                </div>
            </div>
        </div>
  );
};

export default Home;

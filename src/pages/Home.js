import React from 'react';
import MainHero from '../components/MainHero';
import MainHeroImage from '../components/MainHeroImage';

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

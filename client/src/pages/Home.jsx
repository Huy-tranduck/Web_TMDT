import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Banner from '../components/home/Banner';
import FeaturedProducts from '../components/home/FeaturedProducts';
import NewProducts from '../components/home/NewProducts'; // Import component mới
import GiamGiaLon from '../components/home/GiamGiaLon';
import TraGop0 from '../components/home/TraGop0';
import GiaSocOnline from '../components/home/GiaSocOnline';
import GiaReChoMoiNha from '../components/home/GiaReChoMoiNha';

const Home = () => {
  return (
    <MainLayout>
      <Banner />
      <FeaturedProducts />
      <NewProducts />
      <TraGop0 />
      <GiaSocOnline />
      <GiamGiaLon />
      <GiaReChoMoiNha />
    </MainLayout>
  );
};

export default Home;

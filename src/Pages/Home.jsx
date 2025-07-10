import React from 'react'
import Banner from '../Components/Banner'
import TagsSections from '../Components/TagSections'
import Card from '../Components/Card'
import AnnouncementBoard from '../Components/AnnouncementBoard'

const Home = () => {
  return (
    <div>
      <Banner/>
      <TagsSections/>
      <AnnouncementBoard/>
      <Card/>
    </div>
  )
}

export default Home
import React from 'react'
import StoreHeaderCard from '../../../../Components/Card/StoreHeaderCard'
import PremiumCard from '../../../../Components/Card/PremiumCard'
import RelatedProducts from '../../../../Components/Card/RelatedProducts'

const StoreDetails = () => {
  return (
    <div>
      <StoreHeaderCard />
      <RelatedProducts />
      <PremiumCard />
    </div>
  )
}

export default StoreDetails

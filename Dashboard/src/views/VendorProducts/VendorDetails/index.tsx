import VendorHeaderCard from "../../../Components/Cards/VendorHeaderCard";
import PremiumCard from "../../../Components/Cards/PremiumCard";
import RelatedVendors from "../../../Components/Cards/RelatedVendors";

const VendorDetails = () => {
  return (
    <div>
      <VendorHeaderCard />
      <RelatedVendors />
      <PremiumCard />
    </div>
  );
};

export default VendorDetails;

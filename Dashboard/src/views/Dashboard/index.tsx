import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

const Dashboard = () => {
  const list = [
    {
      title: "Products",
      img: "https://nextui.org/images/fruit-1.jpeg",
      price: "6867",
    },
    // {
    //   title: "Customers",
    //   img: "https://nextui.org/images/fruit-2.jpeg",
    //   price: "$3.00",
    // },
    // {
    //   title: "Customer Requests",
    //   img: "https://nextui.org/images/fruit-3.jpeg",
    //   price: "$10.00",
    // },
    {
      title: "Customer Orders",
      img: "https://nextui.org/images/fruit-4.jpeg",
      price: "876",
    },
    {
      title: "Customize Orders",
      img: "https://nextui.org/images/fruit-5.jpeg",
      price: "76",
    },
    {
      title: "Store Orders",
      img: "https://nextui.org/images/fruit-5.jpeg",
      price: "876",
    },
    // {
    //   title: "Transactions",
    //   img: "https://nextui.org/images/fruit-6.jpeg",
    //   price: "$8.00",
    // },
    // {
    //   title: "Over all Reports",
    //   img: "https://nextui.org/images/fruit-7.jpeg",
    //   price: "$7.50",
    // },
    // {
    //   title: "Today Sale",
    //   img: "https://nextui.org/images/fruit-8.jpeg",
    //   price: "$12.20",
    // },
    // {
    //   title: "Weekly Sale",
    //   img: "https://nextui.org/images/fruit-8.jpeg",
    //   price: "$12.20",
    // },
    // {
    //   title: "Monthly Sale",
    //   img: "https://nextui.org/images/fruit-8.jpeg",
    //   price: "$12.20",
    // },
    // {
    //   title: "Yearly Sale",
    //   img: "https://nextui.org/images/fruit-8.jpeg",
    //   price: "$12.20",
    // },
    // {
    //   title: "Other Details",
    //   img: "https://nextui.org/images/fruit-8.jpeg",
    //   price: "$12.20",
    // },
  ];

  return (
    <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
      {list.map((item, index) => (
        <Card
          shadow="sm"
          key={index}
          isPressable
          onPress={() => console.log("item pressed")}
        >
          <CardBody className="overflow-visible p-0">
            <Image
              shadow="sm"
              radius="lg"
              width="100%"
              alt={item.title}
              className="w-full object-cover h-[140px]"
              src={item.img}
            />
          </CardBody>
          <CardFooter className="text-small justify-between">
            <b>{item.title}</b>
            <p className="text-default-500">{item.price}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
export default Dashboard;

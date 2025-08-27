import React from "react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Step 1: Define Your Space",
      description:
        "Create a personal space to keep your shared memories safe. Customize it with a name, theme, and vibe that’s uniquely yours.",
      img: "/l2.png", 
    },
    {
      title: "Step 2: Upload to Timeline",
      description:
        "Add notes, photos, and special moments to your timeline. Relive and reflect on your shared journey anytime you want.",
      img: "/l3.png",
    },
    {
      title: "Step 3:Invite Loved Ones",
      description:
        "Send an invite token to your partner or close ones and start journaling together, building memories side by side.",
      img: "/join.png",
    },
  ];

  return (
    <section className="py-16 font-chewy">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 font-chewy">
    How It Works
        </h2>

        <div className="flex flex-col">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className=" p-6 flex flex-col items-center text-center"
            >
                <h3 className="text-xl font-semibold text-gray-800 font-chewy mb-2">
                 {feature.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{feature.description}</p>
              <img
                src={feature.img}
                alt={feature.title}
                className="w-full h-full object-contain mb-6"
              />
         
         
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

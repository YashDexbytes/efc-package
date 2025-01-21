import ECommerce from "@/components/Dashboard/E-commerce";
import Image from "next/image";
import Link from "next/link";
import { checkIsTenant } from "@/utils/isTenant";
import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [isTenant, setIsTenant] = useState(false);
  useEffect(() => {
    setIsTenant(checkIsTenant());
  }, []);

  return (
        <div className="login-page" id="login-page">
          <div className="login-part flex flex-wrap items-center">
            <div className="w-full">
              <div className="mt-10 text-center">
                <span className="inline-block">
                  <h2 className="text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                    Welcome to Entity Form Crafter
                  </h2>

                  <Image
                    className="mb-5.5 dark:hidden"
                    src="/images/logo/CrafterImage.jpg"
                    alt="Logo"
                    width={400}
                    height={300}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
  );
};
export default Dashboard;

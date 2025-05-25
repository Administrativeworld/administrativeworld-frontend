import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import Login from "./Login";
import Register from "./Register";
import { Sun, Moon } from "@mynaui/icons-react";
import { useTheme } from "../../style/ThemeContext";

function Form() {
  const { toggleTheme, theme } = useTheme();

  return (
    <div className="min-h-screen w-full ">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background backdrop-blur-lg border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <span className="text-xl sm:text-2xl font-bold  bg-clip-text text-text">
                Administrative World
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg  transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={24} className="text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon size={24} className="text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen pt-16">
        {/* Promotional Section - Hidden on mobile, visible on lg+ screens */}
        <div className="hidden lg:flex lg:flex-1 items-center justify-center  relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center text-text px-8 max-w-lg">
            <div className="mb-8">
              <img src="/android-chrome-512x512.png" alt="logo" className="w-44 m-auto" />
            </div>

            <h2 className="text-3xl xl:text-4xl font-bold mb-4">
              Welcome to Administrative World
            </h2>
            <p className="text-md xl:text-lg text-text mb-6">
              Administration world is a training coching provider based across the india that specialises in accredited and bespoke training courses
            </p>

            {/* Feature highlights */}
            {/* <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span className="text-blue-100">Secure user authentication</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span className="text-blue-100">Real-time data management</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span className="text-blue-100">Comprehensive reporting tools</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 lg:max-w-2xl flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
            <Card className="backdrop-blur-sm shadow-2xl border-0 ring-1 ring-gray-200/50 dark:ring-gray-700/50">
              <div className="p-6 sm:p-8 lg:p-10">
                {/* Mobile header */}
                <div className="lg:hidden text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome Back
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Sign in to your account or create a new one
                  </p>
                </div>

                <Tabs defaultValue="tab1" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 h-12 p-1  rounded-lg">
                    <TabsTrigger
                      value="tab1"
                      className="text-base font-medium rounded-md transition-all duration-200"
                    >
                      Login
                    </TabsTrigger>
                    <TabsTrigger
                      value="tab2"
                      className="text-base font-medium rounded-md transition-all duration-200 "
                    >
                      Register
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="tab1" className="space-y-0">
                    <div className="animate-in fade-in-50 duration-200">
                      <Login />
                    </div>
                  </TabsContent>

                  <TabsContent value="tab2" className="space-y-0">
                    <div className="animate-in fade-in-50 duration-200">
                      <Register />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By continuing, you agree to our{" "}
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;
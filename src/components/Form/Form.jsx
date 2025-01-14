import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card"
import Login from "./Login";
import Register from "./Register";
import { Sun, Moon } from "@mynaui/icons-react";
import { useTheme } from "../../style/ThemeContext";

function Form() {
  const { toggleTheme, theme } = useTheme();
  return (
    <div className="flex flex-col justify-center outline items-center h-screen w-screen">
      <div className=" w-full top-0 fixed p-3 flex items-center">
        <div>
          <span className="text-2xl font-bold">Administrative World</span>
        </div>
        <div className=" w-fit ml-auto">
          <div className="text-foreground p-2 rounded-lg">{theme === "dark" ? <Sun size={30} onClick={toggleTheme} /> : <Moon size={30} onClick={toggleTheme} />}</div>
        </div>
      </div>
      <div>
        <Card className="p-7">
          <Tabs defaultValue="tab1" className="sm:w-[400px] xs:w-[330px] vxs:w-[310px] ">
            <TabsList className="grid w-full grid-cols-2 mb-4 h-fit p-2">
              <TabsTrigger value="tab1" className="text-lg">Login</TabsTrigger>
              <TabsTrigger value="tab2" className="text-lg">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <div className=""><Login /></div>
            </TabsContent>
            <TabsContent value="tab2">
              <div className=""><Register /></div>
            </TabsContent>

          </Tabs>
        </Card>
      </div>
    </div>
  )
}

export default Form
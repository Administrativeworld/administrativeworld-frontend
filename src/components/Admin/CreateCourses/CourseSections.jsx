import { ArrowRight, CircleX, Pen, Plus, PlusSquare } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createSection } from "@/redux/api/createSection"
import toast from "react-hot-toast"
import PrimarySpinner from "../../Loaders/PrimarySpinner"
import Subsection from "./Subsection"
import { nextStep, setSectionId } from "@/redux/api/courseBuilderSlice"


function CourseSections() {
  const dispatch = useDispatch();
  const { courseId, sections, subSection } = useSelector(state => state.courseBuilder)
  const [sectionData, setSectionData] = useState({ sectionName: "" })
  const { status, loading } = useSelector((state) => state.createSection)
  const [popup, setPopup] = useState(false);
  const [subSectionPopup, setSubSectionPopup] = useState(false);
  const subSectionPopupToggle = () => {
    setSubSectionPopup(!subSectionPopup)
  }
  useEffect(() => {
    if (courseId) {
      setSectionData({ ...sectionData, courseId: courseId });
    }

  }, [courseId]);

  const submitSection = (e) => {
    e.preventDefault();
    toast.dismiss();
    if (sectionData.sectionName !== "") {
      dispatch(createSection(sectionData));
    } else {
      toast.error("give section name")
    }


  };
  useEffect(() => {
    if (status === 200) {
      toast.success("Section Created");
      setPopup(false)
      setSectionData({ ...sectionData, sectionName: "" })
    } else if (status && status !== 200) {
      toast.error("Something went wrong");
    }
  }, [status]);

  return (
    <div className="">
      <div className=" text-center text-2xl font-medium p-5">Create Course Content</div>
      {
        subSectionPopup ? <Subsection onSubSectionCancle={subSectionPopupToggle} /> : (
          <>
            {
              popup ? (<>
                <Card className="max-w-md mx-auto shadow-lg border ">
                  <CardHeader>
                    <CardTitle className="flex items-center  text-lg font-semibold ">
                      Create Section <Button size='icon' onClick={() => { setPopup(false) }} className="ml-auto"><CircleX className="" /></Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="relative">
                        <Pen className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} />
                        <Input
                          className="pl-10 py-3 rounded-lg border transition-all"
                          type="text"
                          id="section"
                          placeholder="Enter section name"
                          value={sectionData.sectionName || ""} // Ensure it's always a string
                          onChange={(e) => {
                            setSectionData(prev => ({ ...prev, sectionName: e.target.value }));
                          }}
                        />
                      </div>
                      {loading ? (
                        <Button disabled className="w-full flex items-center gap-2 px-4 py-2 rounded-lg  transition-all">

                          Creating <PrimarySpinner />
                        </Button>
                      ) : (
                        <Button type="submit" className="w-full flex items-center gap-2 px-4 py-2 rounded-lg  transition-all"
                          onClick={submitSection}>
                          Create <Plus size={16} />
                        </Button>
                      )}
                    </form>
                  </CardContent>
                </Card>
              </>) : (<>
                <Accordion type="single" collapsible className="w-full">
                  {sections.map((item) => (
                    <AccordionItem key={item._id} value={item._id}>
                      <AccordionTrigger>{item.sectionName}</AccordionTrigger>
                      <div className="w-full border-b"></div>
                      <AccordionContent className="mt-2 pl-5">
                        {subSection && subSection.length > 0 &&
                          subSection
                            .filter((subItem) => subItem._id === item._id) // Ensure we only map over matching subsections
                            .map((subItem, index) => (
                              <div key={index} className="flex flex-col">
                                {subItem.subSection.map((subItemSection, subIndex) => (
                                  <div key={subIndex} className="border-b p-1 flex items-center gap-3 w-full mb-2">
                                    <Pen size={16} /> {subItemSection.title}
                                  </div>
                                ))}
                              </div>
                            ))
                        }

                        <div className="w-full mt-4 justify-end flex">
                          <Button onClick={() => { dispatch(setSectionId(item._id)); subSectionPopupToggle(); }}>
                            Add <PlusSquare />
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}

                </Accordion>
                <div className="py-5 items-end">
                  <div className='ml-auto w-fit'>
                    <Button onClick={() => { setPopup(true); }}>Create Section <Plus /></Button>
                  </div>
                </div>
              </>)
            }
          </>
        )
      }

      {
        sections && sections.length > 0 &&
        <div>
          <Button
            onClick={() => dispatch(nextStep())}
            className="w-full"
          >
            Next <ArrowRight />
          </Button>
        </div>
      }

    </div>

  )
}

export default CourseSections
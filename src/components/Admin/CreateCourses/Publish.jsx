import { BadgeCheck, BookCheck } from "lucide-react"
import { Button } from "../../ui/button"
import { useDispatch, useSelector } from "react-redux"
import PrimarySpinner from "../../Loaders/PrimarySpinner";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { clearPublishState, publishCourse } from "@/redux/api/publishCourse";
import { useNavigate } from "react-router-dom";

function Publish() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useSelector(state => state.courseBuilder)
  const { loading, status } = useSelector(state => state.publishCourse)

  useEffect(() => {
    if (status !== 200) {
      toast.dismiss();
    } else {
      toast.dismiss();
      toast.success(`Course Published`)
      navigate('/admin/course')
      dispatch(clearPublishState())
    }
  })

  const publish = () => {
    if (courseId) {
      console.log(courseId)
      dispatch(publishCourse(courseId))
    }

  }

  return (
    <div >
      <div className=" text-center text-2xl font-medium p-5">Now Publish Course</div>
      <div className="text-center flex flex-col justify-center">
        <div className="mx-auto"><BadgeCheck size={110} color="green" /></div>
        <span className="text-xl mt-2">Your Course Is Ready to Publish</span>
        <div className=" p-3 ">
          {
            loading ?
              <Button disabled>Publishing <PrimarySpinner /></Button> :
              <Button onClick={publish}>Publish <BookCheck /></Button>
          }

        </div>
      </div>

    </div>
  )
}

export default Publish
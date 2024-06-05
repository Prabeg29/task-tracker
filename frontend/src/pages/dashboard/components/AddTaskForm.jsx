import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Option,
  Select,
  Textarea,
  Typography
} from "@material-tailwind/react"
import { useEffect, useState } from "react";

import * as userService from "@/services/user.service"

export const AddTaskForm =  ({ 
  open,
  handleOpen,
  task,
  setTask,
  errors,
  setErrors,
  handleTaskCreate
}) => {
  const [assignedTo, setAssignedTo] = useState([]);

  useEffect(() => {
    fetchAssignedTo()
  }, [])

  const fetchAssignedTo = async () => {
    const { data: { users } } = await userService.fetchAll();

    setAssignedTo(users);
  };

  const validate = (field, value) => {
    switch (field) {
      case "title":
        return value.length === 0 ? "Title is required" : "";
      default:
        return "";
    }
  };

  const handleChange = (event) => {
    console.log(event.target);
    const { name, value } = event.target;
    setTask((prevInputs) => ({ ...prevInputs, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: validate(name, value) }));
  };

  return (
    <section className="grid place-items-center h-screen">
      <Dialog className="p-4" size="md" open={open} handler={handleOpen}>
        <DialogHeader className="justify-between">
          <Typography color="blue-gray" className="mb-1 font-bold">
            Add task
          </Typography>
        </DialogHeader>
        <DialogBody className="overflow-y-scroll">
          <div className="mb-4 flex flex-col gap-1">
            <Input
              color="gray"
              label="Title"
              size="lg"
              name="title"
              value={task.title}
              onChange={handleChange}
              error={errors.title.length > 0}
            />
            {errors.title.length > 0 && (
              <Typography variant="small" color="red" className="text-left">
                {errors.title}
              </Typography>
            )}
          </div>
          <div className="mb-3 flex flex-col gap-6">
            <Textarea
              color="gray"
              size="lg"
              label="Description"
              name="description"
              value={task.description}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3 flex flex-col gap-6">
            <Select
              label="Assigned To"
              name="assignedTo"
              value={task.assignedTo}
              onChange={handleChange}
            >
              { assignedTo.map(user => (<Option key={user.id} value={user.id}>{user.attributes.name}</Option>))}
            </Select>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="blue-gray" onClick={handleOpen}>
            close
          </Button>
          <Button variant="gradient" onClick={handleTaskCreate}>
            Add
          </Button>
        </DialogFooter>
      </Dialog>
    </section>
  );
};

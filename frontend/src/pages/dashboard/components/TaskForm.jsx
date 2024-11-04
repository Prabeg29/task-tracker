import { useEffect, useState } from "react";

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

import * as userService from "@/services/user.service"

export const TaskForm = ({
  isEdit,
  open,
  handleOpen,
  statuses,
  task,
  setTask,
  errors,
  setErrors,
  handleSave
}) => {
  const [assignedTo, setAssignedTo] = useState([]);

  useEffect(() => {
    fetchAssignedTo()
  }, [])

  const fetchAssignedTo = async () => {
    const { data: { users } } = await userService.fetchAll();

    setAssignedTo(users);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setErrors(name, value);
    setTask(name, value);
  };

  const handleSelectChange = (name, value) => {
    setTask(name, value);
  };

  return (
    <section className="grid place-items-center h-screen">
      <Dialog className="p-4" size="md" open={open} handler={() => handleOpen()}>
        <DialogHeader className="justify-between">
          <Typography color="blue-gray" className="mb-1 font-bold">
            {isEdit ? "Update Task" : "Add Task"}
          </Typography>
        </DialogHeader>
        <DialogBody className="overflow-y-scroll">
          <div className="mb-6 flex flex-col gap-1">
            <Input
              color="gray"
              label="Title"
              size="lg"
              name="title"
              value={task.title}
              onChange={handleInputChange}
              error={errors.title?.length > 0}
            />
            {errors.title?.length > 0 && (
              <Typography variant="small" color="red" className="text-left">
                {errors.title}
              </Typography>
            )}
          </div>
          <div className="mb-4 flex flex-col gap-6">
            <Textarea
              color="gray"
              size="lg"
              label="Description"
              name="description"
              value={task.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-6 flex flex-col gap-6">
            <Select
              label="Assigned To"
              name="assignedTo"
              value={task.assignedTo.toString()}
              onChange={value => handleSelectChange("assignedTo", value)}
            >
              {assignedTo.map(user => (<Option key={user.id.toString()} value={user.id.toString()}>{user.attributes.name}</Option>))}
            </Select>
          </div>
          {isEdit && (
            <div className="flex flex-col gap-6">
              <Select
                label="Status"
                name="status"
                value={task.status}
                onChange={value => handleSelectChange("status", value)}
              >
                {statuses.filter(s => s.value !== "all").map(s => (<Option key={s.value} value={s.value}>{s.label}</Option>))}
              </Select>
            </div>
          )}
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="blue-gray" onClick={() => handleOpen()}>
            Close
          </Button>
          <Button variant="gradient" onClick={
            (e) => { handleSave.mutateAsync(e) }}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </section>
  );
};

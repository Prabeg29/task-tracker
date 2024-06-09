import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  IconButton,
  Input,
  Spinner,
  Switch,
  Tab,
  Tabs,
  TabsHeader,
  Tooltip,
  Typography,
} from "@material-tailwind/react";

import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { InformationCircleIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

import { debounce, camelCase } from "lodash";

import { TaskForm } from "./components/TaskForm";

import * as taskService from "@/services/task.service"

export function Tasks() {
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [task, setTask] = useState({
    "title": "",
    "description": "",
    "assignedTo": "",
  });
  const [errors, setErrors] = useState({
    "title": "",
    "description": "",
    "assignedTo": "",
  });
  const [alert, setAlert] = useState({
    "color": "",
    "message": ""
  });

  const TABS = [
    { label: "All", value: "all" },
    { label: "Todo", value: "todo" },
    { label: "WIP", value: "wip" },
    { label: "Complete", value: "complete" },
  ];

  const TABLE_HEAD = ["Title", "Created By", "Assigned To", "Status", "Completed At", "Created At", ""];

  const STATUS_CHIP_COLORS = {
    "todo": "red",
    "wip": "amber",
    "complete": "green"
  };

  useEffect(() => {
    fetchTasks();
  }, [currentPage, search, status, sortBy, sortOrder]);

  const fetchTasks = async () => {
    setIsLoading(true);

    try {
      const { data: { tasks, meta } } = await taskService.fetchAllPaginated({
        currentPage,
        perPage: 25,
        search,
        status: status === "all" ? "" : status,
        sortBy,
        sortOrder
      });
  
      setTasks(tasks);
      setPagination(meta.paginationInfo);
    } catch ({ response: { data, status }  }) {
      if (status !== 422) {
        setAlert({
          "message": `Error: ${data.message}`,
          "color": "red"
        })
      }
      console.error(data.message);
    }

    setIsLoading(false);
    setTimeout(() => {
      setAlert({
        "message": "",
        "color": ""
      });
    }, 3000);
  };

  const debouncedSearch = useMemo(() => {
    return debounce((e) => setSearch(e.target.value), 500);
  }, []);

  const handleSort = (sortColumn) => {
    let newSortBy = camelCase(sortColumn);

    if (newSortBy === "assignedTo" || newSortBy === "createdBy") {
      newSortBy += "User.name";
    }

    const newSortDirection = sortBy === newSortBy ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
    setSortBy(newSortBy);
    setSortOrder(newSortDirection);
  };

  const markTaskAsComplete = async (selectedTask) => {
    let updatedTask = {
      id: selectedTask.id,
      title: selectedTask.attributes.title,
      description: selectedTask.attributes.description,
      assignedTo: selectedTask.relationships.assignedTo.id,
    };
  
    if (selectedTask.attributes.status !== "complete") {
      updatedTask["status"] = "complete"
    } else {
      updatedTask["status"] = "todo";
    }

    setTask(updatedTask);

    try {
      const { id, ...taskData } = updatedTask;
      await taskService.update(id, { ...taskData, assignedTo: Number(taskData.assignedTo) });
      setAlert({
        "message": "Success: Task saved",
        "color": "green"
      })
      await fetchTasks();
    } catch ({ response: { data, status } }) {
      if (status !== 422) {
        setAlert({
          "message": `Error: ${data.message}`,
          "color": "red"
        })
      }
      console.error(data.message);
    }

    setTimeout(() => {
      setAlert({
        "message": "",
        "color": ""
      });
    }, 3000);
  };

  const handleOpen = (task = null) => {
    setIsEdit(false);

    setErrors({
      "title": "",
      "description": "",
      "assignedTo": "",
    })

    if (task) {
      setIsEdit(true);
      setTask({
        "id": task.id,
        "title": task.attributes.title,
        "description": task.attributes.description,
        "assignedTo": task.relationships.assignedTo.id,
        "status": task.attributes.status,
      });
    } else {
      setTask({
        "title": "",
        "description": "",
        "assignedTo": "",
      });
    }

    setOpen((cur) => !cur);
  }

  const validate = (field, value) => {
    switch (field) {
      case "title":
        return value.length === 0 ? "Title is required" : "";
      default:
        return "";
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    setErrors((prevErrors) => ({ ...prevErrors, ["title"]: validate("title", task.title) }));
    
    let hasError = false;
    Object.values(errors).forEach((error) => {
      if (error.length > 0) {
        hasError = true;
      }
    });

    if (hasError) {
      return;
    }

    try {
      if (isEdit) {
        const id = task.id;
        delete task.id;
        await taskService.update(id, { ...task, assignedTo: Number(task.assignedTo) });
      } else {
        await taskService.create({ ...task, assignedTo: Number(task.assignedTo) });
      }
      setAlert({
        "message": "Success: Task saved",
        "color": "green"
      })
      handleOpen();
      await fetchTasks();
      
    } catch ({ response: { data, status } }) {
      if (status !== 422) {
        setAlert({
          "message": `Error: ${data.message}`,
          "color": "red"
        })
      }
      console.err(data.message);
    }
    setTimeout(() => {
      setAlert({
        "message": "",
        "color": ""
      });
    }, 3000);
  };

  const handleTaskDelete = async (id) => {
    try {
      await taskService.destroy(id);
      setAlert({
        "message": "Success: Task deleted",
        "color": "green"
      })
      await fetchTasks();
    } catch ({ response: { data, status } }) {
      if (status !== 422) {
        setAlert({
          "message": `Error: ${data.message}`,
          "color": "red"
        })
      }
      console.error(data.message);
    }
    setTimeout(() => {
      setAlert({
        "message": "",
        "color": ""
      });
    }, 3000);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {isLoading && (<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        < Spinner color="white" />
      </div>)}
      {open &&
        <TaskForm
          isEdit={isEdit}
          open={open}
          handleOpen={handleOpen}
          statuses={TABS}
          task={task}
          setTask={setTask}
          validate={validate}
          errors={errors}
          setErrors={setErrors}
          handleSave={handleSave}
        />}
      <Alert
        open={alert.message.length > 0} 
        onClose={() => setAlert({ "message": "", color: "" })}
        color={alert.color}
        icon={
          <InformationCircleIcon strokeWidth={2} className="h-6 w-6" />
        }
      >
        {alert.message}
      </Alert>
      <Card>
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Tasks list
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button className="flex items-center gap-3" size="sm" onClick={() => handleOpen()}>
                Add task
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Tabs value="all" className="w-full md:w-max">
              <TabsHeader>
                {TABS.map(({ label, value }) => (
                  <Tab key={value} value={value} onClick={() => setStatus(value)}>
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
            <div className="w-full md:w-72">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                name="search"
                onChange={debouncedSearch}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                    onClick={() => handleSort(head)}
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}{" "}
                      {index !== TABLE_HEAD.length - 1 && (
                        <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                      )}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map(
                (task, index) => {
                  const isLast = index === tasks.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={task.id}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {task.attributes.title}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {task.relationships.createdBy.attributes.name}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {task.relationships.assignedTo.attributes.name}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            <Chip 
                              color={STATUS_CHIP_COLORS[task.attributes.status]}
                              value={
                                <Typography
                                  variant="small"
                                  color="white"
                                  className="font-medium capitalize leading-none"
                                >
                                  {task.attributes.status}
                                </Typography>
                              }/>
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {task.attributes.completedAt}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {task.attributes.createdAt}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Mark Task as Complete">
                          <Switch color="green" defaultChecked={task.attributes.status === "complete"} onClick={() => markTaskAsComplete(task)}/>
                        </Tooltip>
                        <Tooltip content="Edit Task">
                          <IconButton variant="text" onClick={() => handleOpen(task)}>
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Delete Task">
                          <IconButton variant="text" onClick={() => handleTaskDelete(task.id)}>
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {currentPage} of {pagination.total}
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              disabled={!pagination.prevPage}
              onClick={() => setCurrentPage(currentPage => currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="sm"
              disabled={!pagination.nextPage}
              onClick={() => setCurrentPage(currentPage => currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Tasks;

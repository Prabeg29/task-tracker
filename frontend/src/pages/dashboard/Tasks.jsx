import { useEffect, useMemo, useState } from "react";

import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Spinner,
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";

import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

import { debounce, camelCase } from "lodash";

import { AddTaskForm } from "./components/AddTaskForm";
import { EditTaskForm } from "./components/EditTaskForm";

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
  const [edit, setEdit] = useState(false);
  const [task, setTask] = useState({
    "title": "",
    "description": "",
    "assignedTo": 3,
  });
  const [errors, setErrors] = useState({
    "title": "",
    "description": "",
    "assignedTo": "",
  });

  const TABS = [
    { label: "All", value: "all" },
    { label: "Todo", value: "todo" },
    { label: "WIP", value: "wip" },
    { label: "Complete", value: "complete" },
  ];

  const TABLE_HEAD = ["Title", "Created By", "Assigned To", "Status", "Completed At", "Created At", ""];

  useEffect(() => {
    fetchTasks();
  }, [currentPage, search, status, sortBy, sortOrder]);

  const fetchTasks = async () => {
    setIsLoading(true);
    const { data: { tasks, meta } } = await taskService.fetchAllPaginated({
      currentPage,
      perPage: 25,
      search,
      status,
      sortBy,
      sortOrder
    });

    setTasks(tasks);
    setPagination(meta.paginationInfo);
    setIsLoading(false);
  };

  const handleSort = (sortColumn) => {
    const newSortBy = camelCase(sortColumn);
    const newSortDirection = sortBy === newSortBy ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
    setSortBy(newSortBy);
    setSortOrder(newSortDirection);
  };

  const handleOpen = () => {
    setTask({
      "title": "",
      "description": "",
      "assignedTo": "",
    });
    setOpen((cur) => !cur);
  }

  const handleEdit = (task = null) => {
    if (task) {
      setTask({
        "id": task.id,
        "title": task.attributes.title,
        "description": task.attributes.description,
        "assignedTo": task.relationships.assignedTo.id,
        "status": task.attributes.status,
      });
    }

    setEdit((cur) => !cur);
  };

  const debouncedSearch = useMemo(() => {
    return debounce((e) => setSearch(e.target.value), 500);
  }, []);

  const handleTaskCreate = async (event) => {
    event.preventDefault();

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
      await taskService.create({ ...task, "assignedTo": 3 });
      handleOpen();
      setTask({
        "title": "",
        "description": "",
        "assignedTo": "",
      });
      setErrors({
        "title": "",
        "description": "",
        "assignedTo": "",
      })
      await fetchTasks();
    } catch ({ response: { data, status } }) {
      console.err(data.message);
    }
  };

  const handleTaskEdit = async (event) => {
    event.preventDefault();

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
      const id = task.id;
      delete task.id;
      await taskService.update(id, { ...task, "assignedTo": 3 });
      handleEdit();
      await fetchTasks();
    } catch ({ response: { data, status } }) {
      console.err(data.message);
    }
  };

  const handleTaskDelete = async (id) => {
    try {
      await taskService.destroy(id);
      await fetchTasks();
    } catch ({ response: { data, status } }) {
      console.err(data.message);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {isLoading && (<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        < Spinner color="white" />
      </div>)}
      {open &&
        <AddTaskForm
          open={open}
          handleOpen={handleOpen}
          task={task}
          setTask={setTask}
          errors={errors}
          setErrors={setErrors}
          handleTaskCreate={handleTaskCreate}
        />}
      {
        edit &&
        <EditTaskForm
          edit={edit}
          handleEdit={handleEdit}
          statuses={TABS}
          task={task}
          setTask={setTask}
          errors={errors}
          setErrors={setErrors}
          handleTaskEdit={handleTaskEdit}
        />
      }
      <Card>
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Tasks list
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button className="flex items-center gap-3" size="sm" onClick={handleOpen}>
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
                            {task.attributes.status}
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
                        <Tooltip content="Edit Task">
                          <IconButton variant="text" onClick={() => handleEdit(task)}>
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

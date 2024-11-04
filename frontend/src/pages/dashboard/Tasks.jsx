import { useMemo, useReducer } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

import { MagnifyingGlassIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

import { debounce, camelCase } from "lodash";

import { TaskForm } from "./components/TaskForm";

import * as taskService from "@/services/task.service"

const TABS = [
  { label: "All", value: "all" },
  { label: "Todo", value: "todo" },
  { label: "WIP", value: "wip" },
  { label: "Complete", value: "complete" },
];

const TABLE_HEAD = ["Title", "Created By", "Assigned To", "Status", "Completed At", "Created At", ""];

const STATUS_CHIP_COLORS = { "todo": "red", "wip": "amber", "complete": "green" };

const initialState = {
  currentPage: 1,
  search: "",
  status: "",
  sortBy: "",
  sortOrder: "asc",
  open: false,
  isEdit: false,
  task: {
    title: "",
    description: "",
    assignedTo: "",
  },
  errors: {
    title: "",
    description: "",
    assignedTo: "",
  },
  alert: {
    color: "",
    message: "",
  },
};

const validate = (field, value) => {
  switch (field) {
    case "title":
      return value.length === 0 ? "Title is required" : "";
    default:
      return "";
  }
};

function taskReducer(state, action) {
  switch (action.type) {
    case "SET_CURRENT_PAGE": return { ...state, currentPage: action.payload };
    case "SET_SEARCH": return { ...state, search: action.payload };
    case "SET_STATUS": return { ...state, status: action.payload };
    case "SET_SORT": return { ...state, sortBy: action.payload.sortBy, sortOrder: action.payload.sortOrder };
    case "TOGGLE_MODAL":
      return {
        ...state,
        open: !state.open,
        task: action?.payload || {title: "", description: "", assignedTo: ""},
        isEdit: !!action.payload,
      };
    case "SET_ERRORS":
      return { ...state, errors: { ...state.errors, [action.field]: validate(action.field, action.value) } };
    case "SET_TASK_FIELD": return { ...state, task: { ...state.task, [action.field]: action.value } };
    case "SET_ALERT": return { ...state, alert: action.payload };
    case "CLEAR_ALERT": return { ...state, alert: { color: "", message: "" } };
    default: return state;
  }
}

export function Tasks() {
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const queryKey = ["fetchTasks", state.currentPage, state.search, state.status, state.sortBy, state.sortOrder];

  const { isPending, data } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const { data: { tasks, meta } } = await taskService.fetchAllPaginated({
          currentPage: state.currentPage,
          perPage: 5,
          search: state.search,
          status: state.status === "all" ? "" : state.status,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder
        });

        return { tasks, paginationInfo: meta.paginationInfo };
      } catch ({ response: { data, status } }) {
        return { data, status };
      }
    },
  });

  const debouncedSearch = useMemo(() => debounce((e) => {
    dispatch({ type: "SET_SEARCH", payload: e.target.value });
  }, 500), []);

  const handleSort = (sortColumn) => {
    let newSortBy = camelCase(sortColumn);

    if (newSortBy === "assignedTo" || newSortBy === "createdBy") {
      newSortBy += "User.name";
    }

    const newSortDirection = state.sortBy === newSortBy ? (state.sortOrder === "asc" ? "desc" : "asc") : "asc";
    dispatch({ type: "SET_SORT", payload: { sortBy: newSortBy, sortOrder: newSortDirection } });
  };

  const markTaskAsCompleteMutation = useMutation({
    mutationFn: async (selectedTask) => {
      let updatedTask = {
        id: selectedTask.id,
        title: selectedTask.attributes.title,
        description: selectedTask.attributes.description,
        assignedTo: selectedTask.relationships.assignedTo.id,
        status: "todo"
      };

      if (selectedTask.attributes.status !== "complete") {
        updatedTask["status"] = "complete"
      }

      const { id, ...taskData } = updatedTask;
      await taskService.update(id, { ...taskData, assignedTo: Number(taskData.assignedTo) });
    },
    onSuccess: () => {
      dispatch({ type: "SET_ALERT", payload: { message: "Success: Task updated", color: "green" } });
      queryClient.invalidateQueries({ queryKey: queryKey })
    },
    onError: ({ response: { data, status } }) => {
      if (status !== 422) {
        dispatch({ type: "SET_ALERT", payload: { message: `Error: ${data.message}`, color: "red" } });
      }
    },
    onSettled: () => setTimeout(() => dispatch({ type: "CLEAR_ALERT" }), 3000),
  });

  const handleOpen = (task = null) => {
    let payload;

    if(task) {
      payload = {
        id: task.id,
        title: task.attributes.title,
        description: task.attributes.description,
        assignedTo: task.relationships.assignedTo.id,
        status: task.attributes.status
      }
    }

    dispatch({ type: "TOGGLE_MODAL", payload });
  };

  const taskSaveMutation = useMutation({
    mutationFn: async (event) => {
      event.preventDefault();

      // setErrors((prevErrors) => ({ ...prevErrors, ["title"]: validate("title", task.title) }));

      // let hasError = false;
      // Object.values(errors).forEach((error) => {
      //   if (error.length > 0) {
      //     hasError = true;
      //   }
      // });

      // if (hasError) {
      //   return;
      // }

      if (state.isEdit) {
        const id = state.task.id;
        delete state.task.id;
        await taskService.update(id, { ...state.task, assignedTo: Number(state.task.assignedTo) });
      } else {
        await taskService.create({ ...state.task, assignedTo: Number(state.task.assignedTo) });
      }
    },
    onSuccess: () => {
      handleOpen();
      dispatch({ type: "SET_ALERT", payload: { message: "Success: Task updated", color: "green" } });
      queryClient.invalidateQueries({ queryKey: queryKey })
    },
    onError: ({ response: { data, status } }) => {
      if (status !== 422) {
        dispatch({ type: "SET_ALERT", payload: { message: `Error: ${data.message}`, color: "red" } });
      }
    },
    onSettled: () => setTimeout(() => dispatch({ type: "CLEAR_ALERT" }), 3000),
  });

  const taskDeleteMutation = useMutation({
    mutationFn: async (id) => await taskService.destroy(id),
    onSuccess: () => {
      dispatch({ type: "SET_ALERT", payload: { message: "Success: Task deleted", color: "green" } });
      queryClient.invalidateQueries({ queryKey: queryKey })
    },
    onError: ({ response: { data, status } }) => {
      if (status !== 422) {
        dispatch({ type: "SET_ALERT", payload: { message: `Error: ${data.message}`, color: "red" } });
      }
    },
    onSettled: () => setTimeout(() => dispatch({ type: "CLEAR_ALERT" }), 3000),
  });

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {isPending && (<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        <Spinner color="white" />
      </div>)}
      {state.open &&
        <TaskForm
          isEdit={state.isEdit}
          open={state.open}
          handleOpen={handleOpen}
          statuses={TABS}
          task={state.task}
          setTask={(field, value) => dispatch({ type: "SET_TASK_FIELD", field, value })}
          errors={state.errors}
          setErrors={(field, value) => dispatch({ type: "SET_ERRORS", field, value })}
          handleSave={taskSaveMutation}
        />}
      <Alert
        open={state.alert.message.length > 0}
        onClose={() => dispatch({ type: "CLEAR_ALERT" })}
        color={state.alert.color}
        icon={
          <InformationCircleIcon strokeWidth={2} className="h-6 w-6" />
        }
      >
        {state.alert.message}
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
                  <Tab key={value} value={value} onClick={() => dispatch({ type: "SET_STATUS", payload: value })}>
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
              {data?.tasks.map(
                (task, index) => {
                  const isLast = index === data.tasks.length - 1;
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
                                  className="font-medium capitalize leading-none text-center"
                                >
                                  {task.attributes.status}
                                </Typography>
                              } />
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
                          <Switch 
                            color="green"
                            defaultChecked={task.attributes.status === "complete"}
                            onClick={() => markTaskAsCompleteMutation.mutate(task)}
                          />
                        </Tooltip>
                        <Tooltip content="Edit Task">
                          <IconButton variant="text" onClick={() => handleOpen(task)}>
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip content="Delete Task">
                          <IconButton variant="text" onClick={() => taskDeleteMutation.mutate(task.id)}>
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
            Page {state.currentPage} of {data?.paginationInfo.lastPage}
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              disabled={!data?.paginationInfo.prevPage}
              onClick={() =>
                dispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: state.currentPage - 1,
                })
              }
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="sm"
              disabled={!data?.paginationInfo.nextPage}
              onClick={() => dispatch({ type: "SET_CURRENT_PAGE", payload: state.currentPage + 1 })}
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

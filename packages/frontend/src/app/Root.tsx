import { useState } from "react";
import * as React from "react";
import {
  AppBar,
  Avatar,
  CircularProgress,
  Dialog,
  IconButton,
  Fab,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Toolbar,
  Typography,
  makeStyles,
} from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

import { Application, GetApplicationsResponse } from "@test-assignment/shared";

import { ApplicationForm } from "./ApplicationForm";

function useApplicationsLoader(): [
  GetApplicationsResponse,
  boolean,
  () => void
] {
  const [applications, setApplications] =
    React.useState<GetApplicationsResponse>([]);
  const [isPending, setIsPending] = React.useState(false);
  const [dumb, setDumb] = React.useState(0);

  React.useEffect(() => {
    const controller: AbortController = new AbortController();
    setIsPending(true);

    fetch(`/api/applications`, { signal: controller.signal })
      .then((r: Response) => r.json())
      .then((apps: GetApplicationsResponse) => {
        apps.sort((a: Application, b: Application) =>
          b.description.localeCompare(a.description, undefined, {
            numeric: true,
          })
        );
        return setApplications(apps);
      })
      .finally(() => setIsPending(false))
      .catch(console.error);

    return () => controller.abort();
  }, [dumb]);

  function reload() {
    setDumb((prevState: number) => prevState + 1);
  }

  return [applications, isPending, reload];
}

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
  },
});

export function Root(): JSX.Element {
  const classes = useStyles();
  const [applications, isPending, reload] = useApplicationsLoader();
  const [selectedApplication, setSelectedApplication] = useState<Application>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function openDialog(forApplication?: Application) {
    setIsDialogOpen(false);

    if (forApplication) {
      setSelectedApplication(forApplication);
    }

    setIsDialogOpen(true);
  }

  function closeDialog() {
    reload();
    setSelectedApplication(undefined);
    setIsDialogOpen(false);
  }

  async function handleDeleteApplication(applicationId: string) {
    await fetch(`/api/applications/${applicationId}`, {
      method: "DELETE",
    });
    reload();
  }

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6">Application List</Typography>
        </Toolbar>
      </AppBar>

      <Fab className={classes.fab} color="primary" onClick={() => openDialog()}>
        <AddIcon />
      </Fab>

      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={closeDialog}
        open={isDialogOpen}
        scroll="paper"
      >
        <ApplicationForm
          application={selectedApplication}
          closeForm={closeDialog}
          onChangeApplicationVersion={openDialog}
        />
      </Dialog>

      {isPending ? (
        <Grid
          alignItems="center"
          className={classes.root}
          container
          justifyContent="center"
        >
          <CircularProgress />
        </Grid>
      ) : (
        <List>
          {applications.map((app: Application) => {
            return (
              <ListItem button key={app.id} onClick={() => openDialog(app)}>
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>

                <ListItemText color="inherit" primary={app.description} />

                <ListItemSecondaryAction>
                  <IconButton
                    color="inherit"
                    edge="end"
                    onClick={() => handleDeleteApplication(app.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      )}
    </>
  );
}

import * as React from "react";

import {
  Button,
  TextField,
  CircularProgress,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Select,
  MenuItem,
} from "@material-ui/core";

import { useForm } from "react-hook-form";

import { Application, GetApplicationsResponse } from "@test-assignment/shared";

export type ApplicationFormProps = {
  application?: Application;
  onChangeApplicationVersion: (application: Application) => void;
  closeForm?: () => void;
};

type FormData = {
  description: string;
  metadata: string;
  data: string;
};

const inputProps = { shrink: true };

const checkIfStringIsValidJson = (value: string): boolean => {
  if (value.length === 0) {
    return true;
  }

  try {
    JSON.parse(value);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

function useApplicationVersionsLoader(
  applicationId?: string
): [GetApplicationsResponse, boolean] {
  const [applications, setApplications] =
    React.useState<GetApplicationsResponse>([]);
  const [isPending, setIsPending] = React.useState(false);

  React.useEffect(() => {
    if (applicationId) {
      const controller: AbortController = new AbortController();
      setIsPending(true);

      fetch(`/api/applications/${applicationId}`, { signal: controller.signal })
        .then((r: Response) => r.json())
        .then((apps: GetApplicationsResponse) => {
          apps.sort((a: Application, b: Application) =>
            b.version.localeCompare(a.version, undefined, { numeric: true })
          );
          return setApplications(apps);
        })
        .finally(() => setIsPending(false))
        .catch(console.error);

      return () => controller.abort();
    }
  }, [applicationId]);

  return [applications, isPending];
}

export function ApplicationForm({
  application,
  onChangeApplicationVersion,
  closeForm,
}: ApplicationFormProps): JSX.Element {
  const [applications, isPending] = useApplicationVersionsLoader(
    application?.id
  );

  const { register, formState, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      description: application?.description,
      metadata:
        application?.metadata && JSON.stringify(application.metadata, null, 2),
      data: application?.data && JSON.stringify(application.data, null, 2),
    },
  });

  const { ref: descriptionRef, ...descriptionRest } = register("description", {
    required: true,
  });

  const { ref: metadataRef, ...metadataRest } = register("metadata", {
    validate: checkIfStringIsValidJson,
  });

  const { ref: dataRef, ...dataRest } = register("data", {
    validate: checkIfStringIsValidJson,
  });

  async function saveApplication({
    description,
    metadata,
    data,
  }: FormData): Promise<void> {
    const body: string = JSON.stringify({
      description,
      metadata,
      data,
    });

    if (application) {
      await fetch(`/api/applications/${application.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
    } else {
      await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
    }

    closeForm?.();
  }

  function handleVersionChange(event: React.ChangeEvent<{ value: unknown }>) {
    const appWithVersion = applications.find(
      (a: Application) => a.version === event.target.value
    );

    if (!appWithVersion) {
      throw new Error(`App with version ${event.target.value} not found`);
    }

    reset({
      description: appWithVersion?.description,
      metadata:
        appWithVersion?.metadata && JSON.stringify(appWithVersion.metadata),
      data: appWithVersion?.data && JSON.stringify(appWithVersion.data),
    });
    onChangeApplicationVersion(appWithVersion);
  }

  return (
    <form onSubmit={handleSubmit(saveApplication)}>
      <DialogTitle>
        <Grid alignItems="center" container justifyContent="space-between">
          <Grid item>
            {application
              ? `Edit application ${application.id}`
              : "Create application"}
          </Grid>

          <Grid item>
            {application &&
              (isPending ? (
                <CircularProgress />
              ) : (
                <Select
                  label="Version"
                  onChange={handleVersionChange}
                  value={application.version}
                  variant="outlined"
                >
                  {applications.map((app: Application) => (
                    <MenuItem key={app.version} value={app.version}>
                      Version {app.version}
                    </MenuItem>
                  ))}
                </Select>
              ))}
          </Grid>
        </Grid>
      </DialogTitle>

      <DialogContent>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <TextField
              {...descriptionRest}
              error={!!formState.errors.description}
              fullWidth
              helperText={formState.errors.description?.message}
              inputRef={descriptionRef}
              label="Description"
              variant="outlined"
            />
          </Grid>

          <Grid item>
            <TextField
              {...metadataRest}
              InputLabelProps={inputProps}
              error={!!formState.errors.metadata}
              fullWidth
              helperText={formState.errors.metadata?.message}
              inputRef={metadataRef}
              label="Metadata"
              multiline
              placeholder={`{ "name": "Application", "author": "unknown" }`}
              rows={4}
              variant="outlined"
            />
          </Grid>

          <Grid item>
            <TextField
              {...dataRest}
              InputLabelProps={inputProps}
              error={!!formState.errors.data}
              fullWidth
              helperText={formState.errors.data?.message}
              inputRef={dataRef}
              label="Data"
              multiline
              placeholder={`{ "group": "employees", "permissions": ["read", "write"] }`}
              rows={4}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button size="medium" type="submit">
          Save
        </Button>
      </DialogActions>
    </form>
  );
}

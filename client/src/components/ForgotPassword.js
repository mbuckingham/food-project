import React from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import * as accountService from "../services/account-service";
import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Typography
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

const styles = (theme) => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address format")
    .required("Email is required")
});

const ForgotPassword = (props) => {
  const { classes, setToast, history, match } = props;

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Formik
          initialValues={{
            email: match.params.email || ""
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, formikBag) => {
            try {
              const response = await accountService.forgotPassword(
                values.email
              );
              if (response.isSuccess) {
                setToast({
                  message:
                    "Please check your email for a 'Reset Password' link."
                });
                history.push("/stakeholders");
              } else if (
                response.code === "FORGOT_PASSWORD_ACCOUNT_NOT_FOUND"
              ) {
                const msg =
                  "Account not found. If you want to create a new account with this email, please register.";
                console.log(msg);
                setToast({
                  message: msg
                });
                formikBag.setSubmitting(false);
              } else if (response.code === "FORGOT_PASSWORD_EMAIL_FAILED") {
                const msg =
                  "A problem occurred with sending an email to this address.";
                console.log(msg);
                setToast({
                  message: msg
                });
                formikBag.setSubmitting(false);
              } else {
                console.log(response.message);
                setToast({
                  message: response.message
                });
                formikBag.setSubmitting(false);
              }
            } catch (err) {
              setToast({
                message: `Server error. ${err.message}`
              });
              console.log(err);
              formikBag.setSubmitting(false);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
            /* and other goodies */
          }) => (
            <form
              className={classes.form}
              noValidate
              onSubmit={(evt) => {
                evt.preventDefault();
                handleSubmit(evt);
              }}
            >
              <TextField
                type="email"
                id="email"
                label="Email"
                name="email"
                variant="outlined"
                margin="normal"
                fullWidth
                autoComplete="email"
                autoFocus
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={touched.email ? errors.email : ""}
                error={touched.email && Boolean(errors.email)}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={isSubmitting}
              >
                Send Reset Link to Email
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href={`/login/${values.email || ""}`} variant="body2">
                    Login
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Register"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </div>
    </Container>
  );
};

export default withStyles(styles)(withRouter(ForgotPassword));

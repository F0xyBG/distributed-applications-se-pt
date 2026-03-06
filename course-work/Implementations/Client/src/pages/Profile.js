import React, { useEffect, useState } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts";
import tw from "twin.macro";
import Header from "components/headers/Header.js";
import Footer from "components/footers/Footer.js";
import { SectionHeading } from "components/misc/Headings";
import { PrimaryButton } from "components/misc/Buttons";
import Cookies from "js-cookie";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Heading = tw(SectionHeading)`text-gray-900`;
const DetailsGrid = tw.div`mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4`;
const DetailCard = tw.div`p-4 rounded-lg bg-gray-100`;
const Label = tw.span`font-bold text-gray-900`;
const InfoText = tw.p`mt-6 p-4 border border-gray-200 rounded-lg bg-gray-500 text-base text-gray-700`;
const ActionsRow = tw.div`mt-8 flex flex-wrap gap-3`;
const Form = tw.form`mt-8 p-6 border border-gray-200 rounded-lg bg-gray-500`;
const FormRow = tw.div`mt-4`;
const InputLabel = tw.label`block text-sm font-semibold text-gray-700 mb-1`;
const TextInput = tw.input`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-500`;
const ErrorText = tw.p`mt-2 text-sm text-red-600`;
const SecondaryButton = tw(PrimaryButton)`bg-gray-600 hover:bg-gray-700 focus:bg-gray-700`;
const DangerButton = tw(PrimaryButton)`bg-red-600 hover:bg-red-700 focus:bg-red-700`;
const SuccessText = tw.p`mt-4 text-green-700 font-medium`;

export default function Profile({ headingText = "My Profile" }) {
  const navigate = useNavigate();
  const userId = Cookies.get("user_id");

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [editValues, setEditValues] = useState({
    username: "",
    name: "",
    phone: "",
    dateOfBirth: ""
  });

  useEffect(() => {
    const backendUrl = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/user`;

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    fetch(backendUrl, {
      method: "GET",
      credentials: "include"
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Unable to load profile (${response.status})`);
        }
        return response.json();
      })
      .then(data => {
        const fetchedProfile = data && data.user ? data.user : data;
        if (!fetchedProfile) {
          throw new Error("Profile data not found.");
        }

        const normalizedProfile = {
          username: fetchedProfile.username || "",
          name: fetchedProfile.name || "",
          registeredRaw: fetchedProfile.registered,
          registered: formatDateTime(fetchedProfile.registered),
          isAdult: Boolean(fetchedProfile.isAdult),
          phone: fetchedProfile.phone || ""
        };

        setProfile(normalizedProfile);
        setEditValues({
          username: normalizedProfile.username,
          name: normalizedProfile.name,
          phone: normalizedProfile.phone,
          dateOfBirth: ""
        });
      })
      .catch(fetchError => {
        setError(fetchError.message || "Failed to load profile.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  const handleEditValueChange = event => {
    const { name, value } = event.target;
    if (name === "username" && usernameError) {
      setUsernameError("");
    }
    setEditValues(current => ({
      ...current,
      [name]: value
    }));
  };

  const isAdultFromDob = dateOfBirth => {
    if (!dateOfBirth) {
      return null;
    }

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDelta = today.getMonth() - birthDate.getMonth();

    if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }

    return age >= 18;
  };

  const handleUpdateProfile = async event => {
    event.preventDefault();
    if (!profile) {
      return;
    }

    const changedFields = {};

    if (editValues.username !== profile.username) {
      changedFields.username = editValues.username;
    }
    if (editValues.name !== profile.name) {
      changedFields.name = editValues.name;
    }
    if (editValues.phone !== profile.phone) {
      changedFields.phone = editValues.phone;
    }

    const newIsAdultValue = isAdultFromDob(editValues.dateOfBirth);
    if (newIsAdultValue !== null && newIsAdultValue !== profile.isAdult) {
      changedFields.isAdult = newIsAdultValue;
    }

    if (Object.keys(changedFields).length === 0) {
      setSuccessMessage("No changes to save.");
      setIsEditing(false);
      return;
    }

    const backendUrl = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/user`;
    setIsSaving(true);
    setError("");
    setSuccessMessage("");
    setUsernameError("");

    try {
      const response = await fetch(backendUrl, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(changedFields)
      });

      if (!response.ok && response.status === 409) {
        setUsernameError("This username is already taken.");
        return;
      } else if (!response.ok) {
        throw new Error(`Unable to update profile (${response.status})`);
      }

      const contentType = response.headers.get("content-type") || "";
      const responseData = contentType.includes("application/json") ? await response.json() : null;
      const returnedProfile = responseData && responseData.user ? responseData.user : responseData;

      setProfile(current => {
        const merged = {
          ...current,
          ...changedFields
        };

        if (!returnedProfile) {
          return merged;
        }

        return {
          username: returnedProfile.username ?? merged.username,
          name: returnedProfile.name ?? merged.name,
          registeredRaw: returnedProfile.registered || merged.registeredRaw,
          registered: formatDateTime(returnedProfile.registered || merged.registeredRaw),
          isAdult: returnedProfile.isAdult !== undefined ? Boolean(returnedProfile.isAdult) : merged.isAdult,
          phone: returnedProfile.phone ?? merged.phone
        };
      });

      setEditValues(current => ({
        ...current,
        dateOfBirth: ""
      }));
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully.");
    } catch (updateError) {
      setError(updateError.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    const shouldDelete = window.confirm("Delete your profile permanently?");
    if (!shouldDelete) {
      return;
    }

    const backendUrl = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/user`;
    setIsDeleting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(backendUrl, {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`Unable to delete profile (${response.status})`);
      }

      Cookies.remove("user_id");
      navigate("/", { replace: true });
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete profile.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimationRevealPage>
      <Header />
      <Container>
        <ContentWithPaddingXl>
          <Heading>{headingText}</Heading>

          {isLoading && <InfoText>Loading profile...</InfoText>}
          {!isLoading && error && <InfoText>{error}</InfoText>}
          {!isLoading && !error && successMessage && <SuccessText>{successMessage}</SuccessText>}

          {!isLoading && !error && profile && (
            <>
              <DetailsGrid>
                <DetailCard>
                  <Label>Username:</Label> {profile.username || "N/A"}
                </DetailCard>
                <DetailCard>
                  <Label>Name:</Label> {profile.name || "N/A"}
                </DetailCard>
                <DetailCard>
                  <Label>Phone:</Label> {profile.phone || "N/A"}
                </DetailCard>
                <DetailCard>
                  <Label>Adult:</Label> {profile.isAdult ? "Yes" : "No"}
                </DetailCard>
                <DetailCard>
                  <Label>Registered:</Label> {profile.registered || "Unknown"}
                </DetailCard>
              </DetailsGrid>

              <ActionsRow>
                {!isEditing && (
                  <PrimaryButton type="button" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </PrimaryButton>
                )}
                <DangerButton type="button" onClick={handleDeleteProfile} disabled={isDeleting || isSaving}>
                  {isDeleting ? "Deleting..." : "Delete Profile"}
                </DangerButton>
              </ActionsRow>

              {isEditing && (
                <Form onSubmit={handleUpdateProfile}>
                  <FormRow>
                    <InputLabel htmlFor="username-input">Username</InputLabel>
                    <TextInput
                      id="username-input"
                      name="username"
                      value={editValues.username}
                      onChange={handleEditValueChange}
                      aria-invalid={Boolean(usernameError)}
                      style={usernameError ? { borderColor: "#dc2626" } : undefined}
                    />
                    {usernameError && <ErrorText>{usernameError}</ErrorText>}
                  </FormRow>

                  <FormRow>
                    <InputLabel htmlFor="name-input">Name</InputLabel>
                    <TextInput id="name-input" name="name" value={editValues.name} onChange={handleEditValueChange} />
                  </FormRow>

                  <FormRow>
                    <InputLabel htmlFor="phone-input">Phone</InputLabel>
                    <TextInput id="phone-input" name="phone" value={editValues.phone} onChange={handleEditValueChange} />
                  </FormRow>

                  <FormRow>
                    <InputLabel htmlFor="dateOfBirth-input">Date of Birth</InputLabel>
                    <TextInput id="dateOfBirth-input" name="dateOfBirth" type="date" value={editValues.dateOfBirth} onChange={handleEditValueChange} />
                  </FormRow>

                  <FormRow>
                    <InputLabel htmlFor="registered-input">Registered</InputLabel>
                    <TextInput id="registered-input" value={profile.registered || "Unknown"} readOnly disabled />
                  </FormRow>

                  <ActionsRow>
                    <PrimaryButton type="submit" disabled={isSaving || isDeleting}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </PrimaryButton>
                    <SecondaryButton
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditValues({
                          username: profile.username || "",
                          name: profile.name || "",
                          phone: profile.phone || "",
                          dateOfBirth: ""
                        });
                      }}
                    >
                      Cancel
                    </SecondaryButton>
                  </ActionsRow>
                </Form>
              )}
            </>
          )}

          {!isLoading && !error && !profile && <InfoText>Profile not found.</InfoText>}

          <ActionsRow>
            <PrimaryButton as={Link} to="/">
              Back Home
            </PrimaryButton>
          </ActionsRow>
        </ContentWithPaddingXl>
      </Container>
      <Footer />
    </AnimationRevealPage>
  );
}

function formatDateTime(date) {
  if (!date) {
    return "";
  }

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  };

  return new Date(date).toLocaleString(undefined, options);
}

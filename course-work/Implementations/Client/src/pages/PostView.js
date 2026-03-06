import React, { useEffect, useState } from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Container, ContentWithPaddingXl } from "components/misc/Layouts";
import tw from "twin.macro";
import Header from "components/headers/Header.js";
import Footer from "components/footers/Footer.js";
import { SectionHeading } from "components/misc/Headings";
import { PrimaryButton } from "components/misc/Buttons";
import Cookies from "js-cookie";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

const Heading = tw(SectionHeading)`text-gray-900`;
const MetaRow = tw.div`mt-4 text-sm text-gray-700 flex flex-wrap gap-4`;
const Label = tw.span`font-bold text-gray-900`;
const DetailsGrid = tw.div`mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4`;
const DetailCard = tw.div`p-4 rounded-lg bg-gray-100`;
const ImageFrame = tw.div`mt-8 h-80 sm:h-96 w-full rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden`;
const FullImage = tw.img`w-full h-full object-contain`;
const Description = tw.p`mt-8 p-4 border border-gray-200 rounded-lg bg-gray-200 text-base text-gray-700 leading-loose whitespace-pre-wrap`;
const EmptyImage = tw.div`mt-8 h-80 w-full rounded-lg bg-gray-200 flex items-center justify-center text-gray-600`;
const ActionsRow = tw.div`mt-10`;
const TopBackRow = tw.div`mb-4 flex justify-start`;
const OwnerActionsRow = tw.div`mt-6 flex flex-wrap gap-3`;
const Form = tw.form`mt-8 p-6 border border-gray-200 rounded-lg bg-gray-500`;
const FormRow = tw.div`mt-4`;
const InputLabel = tw.label`block text-sm font-semibold text-gray-700 mb-1`;
const TextInput = tw.input`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-500`;
const TextAreaInput = tw.textarea`w-full border border-gray-300 rounded px-3 py-2 h-32 resize-none focus:outline-none focus:border-primary-500`;
const SelectInput = tw.select`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-500`;
const SecondaryButton = tw(PrimaryButton)`bg-gray-600 hover:bg-gray-700 focus:bg-gray-700`;
const DangerButton = tw(PrimaryButton)`bg-red-600 hover:bg-red-700 focus:bg-red-700`;
const SuccessText = tw.p`mt-4 text-green-700 font-medium`;
const CommentsSection = tw.div`mt-12`;
const CommentsHeading = tw.h2`text-2xl font-bold text-gray-900`;
const CommentForm = tw.form`mt-4 p-4 border border-gray-200 rounded-lg bg-gray-500`;
const CommentList = tw.div`mt-6 space-y-4`;
const CommentCard = tw.div`p-4 border border-gray-200 rounded-lg bg-white`;
const CommentHeader = tw.div`flex items-start justify-between gap-3`;
const CommentMeta = tw.p`text-sm text-gray-600`;
const CommentText = tw.p`mt-2 text-gray-800 whitespace-pre-wrap`;
const SmallActionsRow = tw.div`mt-3 flex flex-wrap gap-2`;
const SmallActionsTopRow = tw.div`flex flex-wrap gap-2 justify-end`;
const SmallButton = tw.button`px-3 py-2 rounded bg-primary-500 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-50`;
const SmallDangerButton = tw.button`px-3 py-2 rounded bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50`;
const CommentTextArea = tw.textarea`w-full border border-gray-300 rounded px-3 py-2 h-24 resize-none focus:outline-none focus:border-primary-500`;
const CommentsInfoText = tw.p`mt-3 text-sm text-gray-700`;

export default function PostView({ headingText = "Post Details" }) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const userId = Cookies.get("user_id");

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editValues, setEditValues] = useState({
    title: "",
    description: "",
    category: "dog",
    lostAt: "",
    isFound: false
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [comments, setComments] = useState([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [commentActionError, setCommentActionError] = useState("");
  const [commentActionSuccess, setCommentActionSuccess] = useState("");
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);
  const [isDeletingCommentId, setIsDeletingCommentId] = useState(null);

  const commentsBaseUrl = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/comments`;

  const loadComments = async currentPostId => {
    if (!currentPostId) {
      setComments([]);
      return;
    }

    setIsCommentsLoading(true);
    setCommentsError("");

    try {
      const response = await fetch(`${commentsBaseUrl}/${currentPostId}`, {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`Unable to load comments (${response.status})`);
      }

      const data = await response.json();
      const fetchedComments = Array.isArray(data) ? data : data.comments || [];

      setComments(
        fetchedComments.map(comment => ({
          id: comment.id || comment._id,
          comment: comment.comment || "",
          dateRaw: comment.date,
          date: formatDateTime(comment.date),
          author_name: comment.author_name || "Unknown",
          author_id: comment.author_id
        }))
      );
    } catch (loadError) {
      setCommentsError(loadError.message || "Failed to load comments.");
    } finally {
      setIsCommentsLoading(false);
    }
  };

  useEffect(() => {
    if (!postId) {
      setPost(null);
      setIsLoading(false);
      setError("Invalid post URL.");
      return;
    }

    const backendUrl = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/posts/${postId}`;

    setPost(null);
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    fetch(backendUrl, {
      method: "GET",
      credentials: "include"
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Unable to load post (${response.status})`);
        }
        return response.json();
      })
      .then(data => {
        const fetchedPost = data && data.post ? data.post : data;

        if (!fetchedPost) {
          throw new Error("Post not found.");
        }

        setPost({
          id: fetchedPost.id || fetchedPost._id,
          author_id: fetchedPost.author_id,
          title: fetchedPost.title,
          description: fetchedPost.description,
          image: fetchedPost.image,
          category: fetchedPost.category,
          isFound: Boolean(fetchedPost.isFound),
          lostAt: fetchedPost.lostAt,
          dateRaw: fetchedPost.date,
          date: formatDate(fetchedPost.date),
          author_name: fetchedPost.author_name,
          author_phone: fetchedPost.author_phone
        });
        setEditValues({
          title: fetchedPost.title || "",
          description: fetchedPost.description || "",
          category: fetchedPost.category || "dog",
          lostAt: fetchedPost.lostAt || "",
          isFound: Boolean(fetchedPost.isFound)
        });
        setEditImageFile(null);
      })
      .catch(fetchError => {
        setError(fetchError.message || "Failed to load post details.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [postId]);

  useEffect(() => {
    loadComments(postId);
  }, [postId]);

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  const isOwner = post && Number(post.author_id) === Number(userId);
  const canManageComment = comment => Number(comment.author_id) === Number(userId);

  const handleEditValueChange = event => {
    const { name, value } = event.target;
    setEditValues(current => ({
      ...current,
      [name]: name === "isFound" ? value === "true" : value
    }));
  };

  const handleEditSubmit = async event => {
    event.preventDefault();
    if (!post) {
      return;
    }

    const currentValues = {
      title: post.title || "",
      description: post.description || "",
      category: post.category || "",
      lostAt: post.lostAt || "",
      isFound: Boolean(post.isFound)
    };

    const nextValues = {
      title: editValues.title,
      description: editValues.description,
      category: editValues.category,
      lostAt: editValues.lostAt,
      isFound: Boolean(editValues.isFound)
    };

    const changedFields = {};
    Object.keys(nextValues).forEach(key => {
      if (nextValues[key] !== currentValues[key]) {
        changedFields[key] = nextValues[key];
      }
    });

    const hasImageChange = Boolean(editImageFile);

    if (Object.keys(changedFields).length === 0 && !hasImageChange) {
      setSuccessMessage("No changes to save.");
      setIsEditing(false);
      return;
    }

    const backendUrl = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/posts/${post.id}`;
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const requestOptions = {
        method: "PATCH",
        credentials: "include"
      };

      if (hasImageChange) {
        const formData = new FormData();
        Object.entries(changedFields).forEach(([key, value]) => {
          formData.append(key, String(value));
        });
        formData.append("image", editImageFile);
        requestOptions.body = formData;
      } else {
        requestOptions.headers = {
          "Content-Type": "application/json"
        };
        requestOptions.body = JSON.stringify(changedFields);
      }

      const response = await fetch(backendUrl, {
        ...requestOptions
      });

      if (!response.ok) {
        throw new Error(`Unable to update post (${response.status})`);
      }

      const contentType = response.headers.get("content-type") || "";
      const responseData = contentType.includes("application/json") ? await response.json() : null;
      const updatedPost = responseData && responseData.post ? responseData.post : responseData;

      setPost(current => {
        const mergedPost = {
          ...current,
          ...changedFields,
          ...(hasImageChange ? { image: URL.createObjectURL(editImageFile) } : {}),
        };

        if (!updatedPost) {
          return mergedPost;
        }

        return {
          ...mergedPost,
          id: updatedPost.id || updatedPost._id || mergedPost.id,
          author_id: updatedPost.author_id ?? mergedPost.author_id,
          author_name: updatedPost.author_name ?? mergedPost.author_name,
          author_phone: updatedPost.author_phone ?? mergedPost.author_phone,
          dateRaw: updatedPost.date || mergedPost.dateRaw,
          date: formatDate(updatedPost.date || mergedPost.dateRaw)
        };
      });

      setIsEditing(false);
      setEditImageFile(null);
      setSuccessMessage("Post updated successfully.");
    } catch (submitError) {
      setError(submitError.message || "Failed to update post.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post) {
      return;
    }

    const shouldDelete = window.confirm("Delete this post permanently?");
    if (!shouldDelete) {
      return;
    }

    const backendUrl = `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/posts/${post.id}`;
    setIsDeleting(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(backendUrl, {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`Unable to delete post (${response.status})`);
      }

      navigate("/posts");
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete post.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddComment = async event => {
    event.preventDefault();

    const trimmedComment = newCommentText.trim();
    if (!trimmedComment || !postId) {
      return;
    }

    setIsAddingComment(true);
    setCommentActionError("");
    setCommentActionSuccess("");

    try {
      const response = await fetch(commentsBaseUrl, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          post_id: Number(postId),
          comment: trimmedComment
        })
      });

      if (!response.ok) {
        throw new Error(`Unable to add comment (${response.status})`);
      }

      setNewCommentText("");
      setCommentActionSuccess("Comment added.");
      await loadComments(postId);
    } catch (addError) {
      setCommentActionError(addError.message || "Failed to add comment.");
    } finally {
      setIsAddingComment(false);
    }
  };

  const startEditingComment = comment => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.comment);
    setCommentActionError("");
    setCommentActionSuccess("");
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleUpdateComment = async commentId => {
    const trimmedComment = editingCommentText.trim();
    if (!trimmedComment) {
      setCommentActionError("Comment cannot be empty.");
      return;
    }

    setIsUpdatingComment(true);
    setCommentActionError("");
    setCommentActionSuccess("");

    try {
      const response = await fetch(`${commentsBaseUrl}/${commentId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          comment: trimmedComment
        })
      });

      if (!response.ok) {
        throw new Error(`Unable to update comment (${response.status})`);
      }

      cancelEditingComment();
      setCommentActionSuccess("Comment updated.");
      await loadComments(postId);
    } catch (updateError) {
      setCommentActionError(updateError.message || "Failed to update comment.");
    } finally {
      setIsUpdatingComment(false);
    }
  };

  const handleDeleteComment = async commentId => {
    const shouldDelete = window.confirm("Delete this comment?");
    if (!shouldDelete) {
      return;
    }

    setIsDeletingCommentId(commentId);
    setCommentActionError("");
    setCommentActionSuccess("");

    try {
      const response = await fetch(`${commentsBaseUrl}/${commentId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`Unable to delete comment (${response.status})`);
      }

      if (editingCommentId === commentId) {
        cancelEditingComment();
      }
      setCommentActionSuccess("Comment deleted.");
      await loadComments(postId);
    } catch (deleteError) {
      setCommentActionError(deleteError.message || "Failed to delete comment.");
    } finally {
      setIsDeletingCommentId(null);
    }
  };

  return (
    <AnimationRevealPage>
      <Header />
      <Container>
        <ContentWithPaddingXl>
          <TopBackRow>
            <PrimaryButton as={Link} to="/posts">
              Back To Posts
            </PrimaryButton>
          </TopBackRow>

          <Heading>{headingText}</Heading>

          {isLoading && <Description>Loading post details...</Description>}

          {!isLoading && error && <Description>{error}</Description>}

          {!isLoading && !error && successMessage && <SuccessText>{successMessage}</SuccessText>}

          {!isLoading && !error && post && (
            <>
              <h1 tw="mt-6 text-3xl sm:text-4xl font-black text-gray-900">{post.title}</h1>

              <MetaRow>
                <span>
                  <Label>Status:</Label> {post.isFound ? "Found" : "Missing"}
                </span>
                <span>
                  <Label>Posted:</Label> {post.date || "Unknown"}
                </span>
              </MetaRow>

              {post.image ? (
                <ImageFrame>
                  <FullImage src={post.image} alt={post.title || "Post image"} />
                </ImageFrame>
              ) : (
                <EmptyImage>No image available</EmptyImage>
              )}

              <DetailsGrid>
                <DetailCard>
                  <Label>Category:</Label> {post.category || "N/A"}
                </DetailCard>
                <DetailCard>
                  <Label>Lost At:</Label> {post.lostAt || "N/A"}
                </DetailCard>
                <DetailCard>
                  <Label>Author Name:</Label> {post.author_name || "N/A"}
                </DetailCard>
                <DetailCard>
                  <Label>Author Phone:</Label> {post.author_phone || "N/A"}
                </DetailCard>
              </DetailsGrid>

              {post.description ? <Description>{post.description}</Description> : <Description>No description provided.</Description>}

              {isOwner && (
                <OwnerActionsRow>
                  {!isEditing && (
                    <PrimaryButton type="button" onClick={() => setIsEditing(true)}>
                      Edit Post
                    </PrimaryButton>
                  )}
                  <DangerButton type="button" onClick={handleDeletePost} disabled={isDeleting || isSaving}>
                    {isDeleting ? "Deleting..." : "Delete Post"}
                  </DangerButton>
                </OwnerActionsRow>
              )}

              {isOwner && isEditing && (
                <Form onSubmit={handleEditSubmit}>
                  <FormRow>
                    <InputLabel htmlFor="title-input">Title</InputLabel>
                    <TextInput id="title-input" name="title" value={editValues.title} onChange={handleEditValueChange} />
                  </FormRow>

                  <FormRow>
                    <InputLabel htmlFor="description-input">Description</InputLabel>
                    <TextAreaInput id="description-input" name="description" value={editValues.description} onChange={handleEditValueChange} />
                  </FormRow>

                  <FormRow>
                    <InputLabel htmlFor="category-input">Category</InputLabel>
                    <SelectInput id="category-input" name="category" value={editValues.category} onChange={handleEditValueChange}>
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="parrot">Parrot</option>
                      <option value="snake">Snake</option>
                    </SelectInput>
                  </FormRow>

                  <FormRow>
                    <InputLabel htmlFor="lostAt-input">Lost At</InputLabel>
                    <TextInput id="lostAt-input" name="lostAt" value={editValues.lostAt} onChange={handleEditValueChange} />
                  </FormRow>

                  <FormRow>
                    <InputLabel htmlFor="image-input">Image</InputLabel>
                    <TextInput
                      id="image-input"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={event => {
                        const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
                        setEditImageFile(file);
                      }}
                    />
                    {editImageFile && <p tw="mt-2 text-sm text-gray-700">Selected: {editImageFile.name}</p>}
                  </FormRow>

                  <FormRow>
                    <InputLabel htmlFor="isFound-input">Status</InputLabel>
                    <SelectInput id="isFound-input" name="isFound" value={String(editValues.isFound)} onChange={handleEditValueChange}>
                      <option value="false">Missing</option>
                      <option value="true">Found</option>
                    </SelectInput>
                  </FormRow>

                  <OwnerActionsRow>
                    <PrimaryButton type="submit" disabled={isSaving || isDeleting}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </PrimaryButton>
                    <SecondaryButton
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditValues({
                          title: post.title || "",
                          description: post.description || "",
                          category: post.category || "dog",
                          lostAt: post.lostAt || "",
                          isFound: Boolean(post.isFound)
                        });
                        setEditImageFile(null);
                      }}
                    >
                      Cancel
                    </SecondaryButton>
                  </OwnerActionsRow>
                </Form>
              )}

              <CommentsSection>
                <CommentsHeading>Comments</CommentsHeading>

                <CommentForm onSubmit={handleAddComment}>
                  <CommentTextArea
                    value={newCommentText}
                    onChange={event => setNewCommentText(event.target.value)}
                    placeholder="Write a comment..."
                  />
                  <SmallActionsRow>
                    <SmallButton type="submit" disabled={isAddingComment}>
                      {isAddingComment ? "Posting..." : "Post Comment"}
                    </SmallButton>
                  </SmallActionsRow>
                </CommentForm>

                {commentActionError && <CommentsInfoText>{commentActionError}</CommentsInfoText>}
                {!commentActionError && commentActionSuccess && <SuccessText>{commentActionSuccess}</SuccessText>}
                {isCommentsLoading && <CommentsInfoText>Loading comments...</CommentsInfoText>}
                {!isCommentsLoading && commentsError && <CommentsInfoText>{commentsError}</CommentsInfoText>}

                {!isCommentsLoading && !commentsError && (
                  <CommentList>
                    {comments.length === 0 && <CommentsInfoText>No comments yet.</CommentsInfoText>}

                    {comments.map(comment => (
                      <CommentCard key={comment.id}>
                        <CommentHeader>
                          <CommentMeta>
                            <Label>{comment.author_name}</Label> • {comment.date || "Unknown date"}
                          </CommentMeta>

                          {canManageComment(comment) && (
                            <SmallActionsTopRow>
                              {editingCommentId === comment.id ? (
                                <>
                                  <SmallButton
                                    type="button"
                                    onClick={() => handleUpdateComment(comment.id)}
                                    disabled={isUpdatingComment}
                                  >
                                    {isUpdatingComment ? "Saving..." : "Save"}
                                  </SmallButton>
                                  <SmallButton type="button" onClick={cancelEditingComment}>
                                    Cancel
                                  </SmallButton>
                                </>
                              ) : (
                                <>
                                  <SmallButton type="button" onClick={() => startEditingComment(comment)}>
                                    Edit
                                  </SmallButton>
                                  <SmallDangerButton
                                    type="button"
                                    onClick={() => handleDeleteComment(comment.id)}
                                    disabled={isDeletingCommentId === comment.id}
                                  >
                                    {isDeletingCommentId === comment.id ? "Deleting..." : "Delete"}
                                  </SmallDangerButton>
                                </>
                              )}
                            </SmallActionsTopRow>
                          )}
                        </CommentHeader>

                        {editingCommentId === comment.id && canManageComment(comment) ? (
                          <>
                            <CommentTextArea
                              value={editingCommentText}
                              onChange={event => setEditingCommentText(event.target.value)}
                            />
                          </>
                        ) : (
                          <>
                            <CommentText>{comment.comment}</CommentText>
                          </>
                        )}
                      </CommentCard>
                    ))}
                  </CommentList>
                )}
              </CommentsSection>
            </>
          )}

          {!isLoading && !error && !post && <Description>Post not found.</Description>}

        </ContentWithPaddingXl>
      </Container>
      <Footer />
    </AnimationRevealPage>
  );
}

function formatDate(date) {
  if (!date) {
    return "";
  }
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}

function formatDateTime(date) {
  if (!date) {
    return "";
  }
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  };
  return new Date(date).toLocaleString(undefined, options);
}

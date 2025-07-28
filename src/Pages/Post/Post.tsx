import React, { useState } from "react";
import type { ChangeEvent, KeyboardEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { AxiosError } from "axios";

axios.defaults.withCredentials = true;

interface PostState {
  title: string;
  photo: File | null;
  category: string;
  conditions: string;
  description: string;
  location: string;
  price: string;
  negotiable: boolean;
}

interface ErrorState {
  [key: string]: string;
}

const PostCreation: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [post, setPost] = useState<PostState>({
    title: "",
    photo: null,
    category: "",
    conditions: "",
    description: "",
    location: "",
    price: "",
    negotiable: false,
  });
  const [preview, setPreview] = useState<string>("");
  const [errors, setErrors] = useState<ErrorState>({});
  const navigate = useNavigate();

  const validateStep = (currentStep: number): boolean => {
    const newErrors: ErrorState = {};

    if (currentStep === 1) {
      if (!post.title.trim()) newErrors.title = "Title is required";
      if (!post.photo) newErrors.photo = "Photo is required";
    }

    if (currentStep === 2) {
      if (!post.category) newErrors.category = "Category is required";
      if (!post.conditions) newErrors.conditions = "Condition is required";
      if (!post.description.trim())
        newErrors.description = "Description is required";
    }

    if (currentStep === 3) {
      if (!post.location.trim()) newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type } = e.target;

    if (type === "checkbox" && "checked" in e.target) {
      setPost((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    }
    else {
      const { value } = e.target;
      setPost((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNumberInput = (e: KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
    ];
    const isNumber = /[0-9]/.test(e.key);
    const isDecimal = e.key === "." && !e.currentTarget.value.includes(".");
    if (!isNumber && !isDecimal && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPost((prev) => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
      if (errors.photo) {
        setErrors((prev) => ({ ...prev, photo: "" }));
      }
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validateStep(3)) {
      const formData = new FormData();
      formData.append("title", post.title);
      if (post.photo) formData.append("photo", post.photo);
      formData.append("category", post.category);
      formData.append("conditions", post.conditions);
      formData.append("description", post.description);
      formData.append("location", post.location);
      formData.append("price", post.price);
      formData.append("negotiable", post.negotiable ? "true" : "false");

      try {
        await axios.post("http://localhost:8081/api/posts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        navigate("/");
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        alert(error.response?.data?.message || "Failed to create post");
      }
    }
  };

  const isStepValid = (): boolean => {
    if (step === 1) return !!post.title.trim() && !!post.photo;
    if (step === 2)
      return !!post.category && !!post.conditions && !!post.description.trim();
    if (step === 3) return !!post.location.trim();
    return true;
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-6 bg-white rounded-xl shadow-md font-poppins">
      <div className="text-center text-lg font-semibold text-red-700 mb-6">
        Step {step} of 4
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center text-gray-800">
            Title and Photo
          </h2>
          <input
            name="title"
            type="text"
            value={post.title}
            onChange={handleChange}
            placeholder="Title"
            className={`w-full p-3 border rounded-lg ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}

          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className={`w-full ${errors.photo ? "border-red-500" : ""}`}
          />
          {errors.photo && (
            <p className="text-sm text-red-500">{errors.photo}</p>
          )}

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="rounded-lg w-full h-auto shadow"
            />
          )}

          <button
            onClick={nextStep}
            disabled={!isStepValid()}
            className={`w-full py-2 mt-4 rounded-lg font-semibold text-white ${
              isStepValid()
                ? "bg-red-700 hover:bg-red-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center text-gray-800">
            Details
          </h2>
          <select
            name="category"
            value={post.category}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${
              errors.category ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Category</option>
            <option value="Apparels & Accessories">
              Apparels & Accessories
            </option>
            <option value="Automobiles">Automobiles</option>
            <option value="Beauty and health">Beauty and health</option>
            <option value="Books and learning">Books and learning</option>
            <option value="Business and industry">Business and industry</option>
            <option value="Computers and peripherals">
              Computers and peripherals
            </option>
            <option value="Electronics, TVs and more">
              Electronics, TVs and more
            </option>
            <option value="Events and Happenings">Events and Happenings</option>
            <option value="Jobs">Jobs</option>
            <option value="Music Instruments">Music Instruments</option>
            <option value="Mobile Phones and Accessories">
              Mobile Phones and Accessories
            </option>
            <option value="Pets for adoption">Pets for adoption</option>
            <option value="Toys and video games">Toys and video games</option>
            <option value="Travel, Tours and Packages">
              Travel, Tours and Packages
            </option>
            <option value="Services">Services</option>
            <option value="Furnishing and Appliances">
              Furnishing and Appliances
            </option>
            <option value="Fresh vegetables and meat">
              Fresh vegetables and meat
            </option>
            <option value="Want to buy">Want to buy</option>
          </select>
          {errors.category && (
            <p className="text-sm text-red-500">{errors.category}</p>
          )}

          <select
            name="conditions"
            value={post.conditions}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${
              errors.conditions ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Condition</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="refurbished">Refurbished</option>
          </select>
          {errors.conditions && (
            <p className="text-sm text-red-500">{errors.conditions}</p>
          )}

          <textarea
            name="description"
            value={post.description}
            onChange={handleChange}
            placeholder="Description"
            className={`w-full p-3 border rounded-lg resize-y ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}

          <div className="flex justify-between mt-4 gap-2">
            <button
              onClick={prevStep}
              className="w-1/2 py-2 bg-gray-300 rounded-lg"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`w-1/2 py-2 rounded-lg font-semibold text-white ${
                isStepValid()
                  ? "bg-red-700 hover:bg-red-800"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center text-gray-800">
            Location
          </h2>
          <select
            name="location"
            value={post.location}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg ${
              errors.location ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select a location</option>
            <option value="Kathmandu">Kathmandu</option>
            <option value="Lalitpur">Lalitpur</option>
            <option value="Bhaktapur">Bhaktapur</option>
            <option value="Pokhara">Pokhara</option>
            <option value="Biratnagar">Biratnagar</option>
            <option value="Butwal">Butwal</option>
            <option value="Dharan">Dharan</option>
            <option value="Chitwan">Chitwan</option>
          </select>
          {errors.location && (
            <p className="text-sm text-red-500">{errors.location}</p>
          )}

          <div className="flex justify-between mt-4 gap-2">
            <button
              onClick={prevStep}
              className="w-1/2 py-2 bg-gray-300 rounded-lg"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`w-1/2 py-2 rounded-lg font-semibold text-white ${
                isStepValid()
                  ? "bg-red-700 hover:bg-red-800"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center text-gray-800">
            Pricing
          </h2>
          <input
            name="price"
            type="number"
            value={post.price}
            onChange={handleChange}
            onKeyDown={handleNumberInput}
            placeholder="Price"
            min="0"
            step="0.01"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="negotiable"
              checked={post.negotiable}
              onChange={handleChange}
            />
            <span className="text-sm">Price is negotiable</span>
          </label>

          <div className="flex justify-between mt-4 gap-2">
            <button
              onClick={prevStep}
              className="w-1/2 py-2 bg-gray-300 rounded-lg"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="w-1/2 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-semibold"
            >
              Submit Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCreation;

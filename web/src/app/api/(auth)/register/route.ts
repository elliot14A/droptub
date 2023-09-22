import { registerCredentialsSchema } from "@/lib/validators";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";

export const POST = async (req: Request) => {
  const body = await req.json();
  try {
    const { name, email, password } = registerCredentialsSchema.parse(body);
    const serverUrl = process.env.PUBLIC_NEXT_BLOG_POSTS_SERVER_URL;
    await axios.post(serverUrl + "/api/register", {
      name,
      email,
      password,
    });
    return new Response("OK", {
      status: 201,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return new Response(JSON.stringify(err), {
        status: 400,
      });
    }
    if (err instanceof AxiosError) {
      if (err.response?.status === 409) {
        return new Response(
          JSON.stringify({ message: "email is already taken" }),
          { status: 409 },
        );
      } else if (err.response?.status === 400) {
        return new Response(JSON.stringify(err.response.data), {
          status: 400,
        });
      }
      return new Response(JSON.stringify(err), { status: 500 });
    }
    return new Response(JSON.stringify(err), { status: 500 });
  }
};

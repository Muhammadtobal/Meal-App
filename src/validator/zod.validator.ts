import { z } from "zod";
import { Category } from "../entities/category.entitiy";
import { Item } from "../entities/item.entity";
import { User } from "../entities/user.entity";
import { Reservation } from "../entities/reservation.entity";
import { Order } from "../entities/order.entity";
export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(20, "Name very long"),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Password must be at least 8 characters, including one uppercase letter, one lowercase letter, and one number"
    ),
  email: z
    .string()
    .email("Invalid email address")
    .min(6, "Email must be at least 6 characters")
    .max(60, "Email must be less than or equal to 60 characters"),
});
export const loginSchema = z.object({
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Password must be at least 8 characters, including one uppercase letter, one lowercase letter, and one number"
    ),
  email: z
    .string()
    .email("Invalid email address")
    .min(6, "Email must be at least 6 characters")
    .max(60, "Email must be less than or equal to 60 characters"),
});
export const getOneUserSchema = z.object({
  id: z.number().min(1, "the id shouid be 1 or more"),
});
export const updateUserSchema = z.object({
  id: z.number().min(1, "the id shouid be 1 or more"),

  name: z.string().min(1, "Name is required").max(20, "Name very long"),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Password must be at least 8 characters, including one uppercase letter, one lowercase letter, and one number"
    ),
  email: z
    .string()
    .email("Invalid email address")
    .min(6, "Email must be at least 6 characters")
    .max(60, "Email must be less than or equal to 60 characters"),
  role: z.enum(["Admin", "Employee", "Customer"], {
    errorMap: () => ({
      message: "The Role should be Admin, Employee, or Customer",
    }),
  }),
});
export const createCategorySchema = z.object({
  name: z.string().nonempty("the name should be nonempty"),
  parent: z.preprocess(
    (val) => Number(val),
    z.number().superRefine(async (val, ctx) => {
      if (isNaN(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid category ID. Must be a number.",
        });
        return;
      }

      const exist = await Category.findOne({
        where: { id: val },
        relations: ["subcategories"],
      });
      if (!exist) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid category ID. Category not found.",
        });
      }
    })
  ),
});

export const createItemSchema = z.object({
  name: z.string().nonempty("The name should not be empty"),
  price: z.preprocess((val) => Number(val), z.number()),
  description: z.string().min(1, "The description should not be empty"),
  category: z.preprocess(
    (val) => Number(val),
    z.number().superRefine(async (val, ctx) => {
      if (isNaN(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid category ID. Must be a number.",
        });
        return;
      }

      const exist = await Category.findOne({ where: { id: val } });
      if (!exist) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid category ID. Category not found.",
        });
      }
    })
  ),
  image: z.string().optional(),
});

export const updateItemSchema = z.object({
  name: z.string().nonempty("nonempty").optional(),
  price: z.preprocess((val) => Number(val), z.number()).optional(),
  description: z
    .string()
    .min(1, "The description should not be empty")
    .optional(),
  category: z
    .preprocess(
      (val) => Number(val),
      z.number().superRefine(async (val, ctx) => {
        if (isNaN(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid category ID. Must be a number.",
          });
          return;
        }

        const exist = await Category.findOne({
          where: { id: val },
          relations: ["items"],
        });
        if (!exist) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid category ID. Category not found.",
          });
        }
      })
    )
    .optional(),
  image: z.string().optional(),
});
const now = new Date();
export const createReservationSchema = z.object({
  reservationTime: z
    .preprocess((val) => {
      const date = new Date(val as string);

      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }

      return date;
    }, z.date())
    .refine((date) => date.getTime() >= now.getTime(), {
      message: "Reservation time must be in the present or future",
    }),
  duration: z
    .number({
      invalid_type_error: "Duration must be a number representing hours.",
    })

    .int("Duration must be a whole number without decimals.")

    .min(1, "Minimum duration is 1 hour.")

    .max(6, "Maximum duration is 6 hours."),
  user: z.preprocess(
    (val) => Number(val),
    z.number().superRefine(async (val, ctx) => {
      if (isNaN(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid category ID. Must be a number.",
        });
        return;
      }

      const exist = await User.findOne({
        where: { id: val },
        relations: ["reservations"],
      });
      if (!exist) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid User ID. User not found.",
        });
      }
    })
  ),
  tableNumber: z
    .number({
      invalid_type_error: "tableNumber must be a number ",
    })

    .int("tableNumber must be a whole number without decimals.")

    .min(1, "Sorry We Have In Our Resturan just 20 Tabel")

    .max(20, "Sorry We Have In Our Resturan just 20 Tabel"),
});
export const updateReservationSchema = z.object({
  duration: z
    .number({
      invalid_type_error: "Duration must be a number representing hours.",
    })

    .int("Duration must be a whole number without decimals.")

    .min(1, "Minimum duration is 1 hour.")

    .max(48, "Maximum duration is 6 hours.")
    .optional(),
  user: z
    .preprocess(
      (val) => Number(val),
      z.number().superRefine(async (val, ctx) => {
        if (isNaN(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid category ID. Must be a number.",
          });
          return;
        }

        const exist = await User.findOne({
          where: { id: val },
          relations: ["reservations"],
        });
        if (!exist) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid User ID. User not found.",
          });
        }
      })
    )
    .optional(),
  tableNumber: z
    .number({
      invalid_type_error: "tableNumber must be a number ",
    })

    .int("tableNumber must be a whole number without decimals.")

    .min(1, "Sorry We Have In Our Resturan just 20 Tabel")

    .max(20, "Sorry We Have In Our Resturan just 20 Tabel")
    .optional(),
  status: z.enum(["confirmed", "canceled", "completed"]).optional(),
});
export const createOrderSchema = z.object({
  user: z.preprocess(
    (val) => Number(val),
    z.number().superRefine(async (val, ctx) => {
      if (isNaN(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid category ID. Must be a number.",
        });
        return;
      }

      const exist = await User.findOne({
        where: { id: val },
        relations: ["orders"],
      });
      if (!exist) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid User ID. User not found.",
        });
      }
    })
  ),
  reservation: z
    .preprocess(
      (val) => Number(val),
      z.number().superRefine(async (val, ctx) => {
        if (isNaN(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid reservation ID. Must be a number.",
          });
          return;
        }

        const exist = await Reservation.findOne({
          where: { id: val },
          relations: ["orders"],
        });
        if (!exist) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid reservation ID. reservation not found.",
          });
        }
      })
    )
    .optional(),
});
export const updateOrderSchema = z.object({
  user: z
    .preprocess(
      (val) => Number(val),
      z.number().superRefine(async (val, ctx) => {
        if (isNaN(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid category ID. Must be a number.",
          });
          return;
        }

        const exist = await User.findOne({
          where: { id: val },
          relations: ["orders"],
        });
        if (!exist) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid User ID. User not found.",
          });
        }
      })
    )
    .optional(),
  reservation: z
    .preprocess(
      (val) => Number(val),
      z.number().superRefine(async (val, ctx) => {
        if (isNaN(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid reservation ID. Must be a number.",
          });
          return;
        }

        const exist = await Reservation.findOne({
          where: { id: val },
          relations: ["orders"],
        });
        if (!exist) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid reservation ID. reservation not found.",
          });
        }
      })
    )
    .optional(),
  status: z.enum(["Pending", "Preparing", "Ready", "Delivered"]).optional(),
});
export const createOrderDetailSchema = z.object({
  order: z.preprocess(
    (val) => Number(val),
    z.number().superRefine(async (val, ctx) => {
      if (isNaN(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid order ID. Must be a number.",
        });
        return;
      }

      const exist = await Order.findOne({
        where: { id: val },
        relations: ["orderDetails"],
      });
      if (!exist) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid Order ID. Order not found.",
        });
      }
    })
  ),

  item: z.preprocess(
    (val) => Number(val),
    z.number().superRefine(async (val, ctx) => {
      if (isNaN(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid item ID. Must be a number.",
        });
        return;
      }

      const exist = await Item.findOne({
        where: { id: val },
        relations: ["orderDetails"],
      });
      if (!exist) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid Item ID. Item not found.",
        });
      }
    })
  ),
  quantity: z
    .number()
    .min(1, "the quantity should be 1 or mor")
    .max(2000, "the quantity should be less 2000 "),
});
export const updateOrderdetailSchema = z.object({
  order: z.number().optional(),

  item: z.number().optional(),
  quantity: z
    .number()
    .min(1, "the quantity should be 1 or mor")
    .max(2000, "the quantity should be less 2000 ")
    .optional(),
});

export const createTableSchema = z.object({
  capacity: z
    .number()
    .min(2, "the capacity minimum 2 ")
    .max(10, "the capacity maximum 10"),
  numberTable: z
    .number()
    .min(1, "the tableNumber should be minimum 1")
    .max(100, "the tableNumber should be maximum 100"),
});

export const updateTableSchema = z.object({
  capacity: z
    .number()
    .min(2, "the capacity minimum 2 ")
    .max(10, "the capacity maximum 10").optional(),
  numberTable: z
    .number()
    .min(1, "the tableNumber should be minimum 1")
    .max(100, "the tableNumber should be maximum 100").optional(),
});
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type LoginUserDto = z.infer<typeof loginSchema>;
export type GetOneUserDto = z.infer<typeof getOneUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type createCategoryDto = z.infer<typeof createCategorySchema>;
export type createItemDto = z.infer<typeof createItemSchema>;
export type UpdateItemDto = z.infer<typeof updateItemSchema>;
export type UpdateReservationDto = z.infer<typeof updateReservationSchema>;
export type CreateOrdertionDto = z.infer<typeof createOrderSchema>;
export type UpdateOrdertionDto = z.infer<typeof updateOrderSchema>;
export type CreateOrdertDetailionDto = z.infer<typeof createOrderDetailSchema>;
export type UpdateOrdertDetailionDto = z.infer<typeof updateOrderdetailSchema>;
export type CreateTableDto = z.infer<typeof createTableSchema>;
export type UpdateTableDto = z.infer<typeof updateTableSchema>;

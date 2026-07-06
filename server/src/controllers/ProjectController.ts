import { Request, Response } from "express";
import prisma from "../prisma";
import { getAuth } from "@clerk/express";

export const getProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
    const projects = await prisma.project.findMany({
      where: {
        orgId: user?.orgId || null,
      },
    });
    res.json(projects);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error retrieving projects.", details: String(err) });
  }
};

export const getProjectById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        tasks: true,
        projectTeams: {
          include: {
            team: true,
          },
        },
      },
    });

    if (!project) {
      res.status(404).json({ error: "Project not found." });
      return;
    }

    res.json(project);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error retrieving project.", details: String(err) });
  }
};

export const createProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;

  try {
    const user = (req as any).user;
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        startDate,
        endDate,
        orgId: user?.orgId || null,
      },
    });
    res.status(201).json(newProject);
  } catch (err) {
    console.error("DEBUG createProject ERROR:", err);
    res
      .status(500)
      .json({ error: "Error creating project.", details: String(err) });
  }
};

export const updateProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, description, startDate, endDate } = req.body;

  try {
    const updatedProject = await prisma.project.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        description,
        startDate,
        endDate,
      },
    });
    res.json(updatedProject);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error updating project.", details: String(err) });
  }
};

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.project.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(204).send();
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error deleting project.", details: String(err) });
  }
};
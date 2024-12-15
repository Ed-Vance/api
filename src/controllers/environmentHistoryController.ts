import { Request, Response, RequestHandler } from 'express';
import * as environmentHistoryService from '../services/environmentHistoryService';
 
export const getAllEnvironmentHistories: RequestHandler = async (req: Request, res: Response) => {
  try {
    const histories = await environmentHistoryService.getAllEnvironmentHistories();
    res.json(histories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getEnvironmentHistoryByIds: RequestHandler = async (req: Request, res: Response) => {
  const environmentId = Number(req.params.environmentId);
  const userId = Number(req.params.userId);

  if (isNaN(environmentId) || isNaN(userId)) {
    res.status(400).json({ error: 'Invalid environment ID or user ID' });
    return;
  }

  try {
    const history = await environmentHistoryService.getEnvironmentHistoryByIds(environmentId, userId);
    if (history && history.length > 0) {
      res.json(history);
    } else {
      res.status(404).json({ error: 'Environment history not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createEnvironmentHistory: RequestHandler = async (req: Request, res: Response) => {
  const { environment_id, user_id, timestamp, message, message_type } = req.body;
  if (!environment_id || !user_id || !timestamp || !message || !message_type) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const newHistory = await environmentHistoryService.createEnvironmentHistory({
      environment_id,
      user_id,
      timestamp: new Date(timestamp),
      message,
      message_type,
    });
    res.status(201).json(newHistory);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEnvironmentHistory: RequestHandler = async (req: Request, res: Response) => {
  const environmentId = Number(req.params.environmentId);
  const userId = Number(req.params.userId);

  if (isNaN(environmentId) || isNaN(userId)) {
    res.status(400).json({ error: 'Invalid environment ID or user ID' });
    return;
  }

  try {
    const deletedHistory = await environmentHistoryService.deleteEnvironmentHistory(environmentId, userId);
    if (deletedHistory && deletedHistory.length > 0) {
      res.json(deletedHistory);
    } else {
      res.status(404).json({ error: 'Environment history not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

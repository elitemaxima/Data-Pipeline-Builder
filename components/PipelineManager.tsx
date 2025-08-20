"use client";

import React, { useState, useEffect } from "react";
import { Play, Plus, RefreshCw, CheckCircle, XCircle } from "lucide-react";

interface Pipeline {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

interface PipelineRun {
  id: number;
  pipeline_id: number;
  status: "queued" | "running" | "completed" | "failed";
  started_at?: string;
  completed_at?: string;
}

const PipelineManager: React.FC = () => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [pipelineRuns, setPipelineRuns] = useState<PipelineRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = "http://localhost:8000/api/v1";

  // Fetch pipelines
  const fetchPipelines = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pipelines/pipelines`);
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched pipelines:", data);
        setPipelines(data);
      }
    } catch (err) {
      setError("Failed to fetch pipelines");
      console.error("Error fetching pipelines:", err);
    }
  };

  // Create sample pipeline
  const createSamplePipeline = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/pipelines/pipelines`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const pipelineId = await response.json();
        await fetchPipelines();
        setError(null);
        return pipelineId;
      } else {
        throw new Error("Failed to create pipeline");
      }
    } catch (err) {
      setError("Failed to create sample pipeline");
      console.error("Error creating pipeline:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Execute pipeline
  const executePipeline = async (pipelineId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/pipelines/pipelines/${pipelineId}/execute`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const pipelineRun = await response.json();
        setPipelineRuns((prev) => [...prev, pipelineRun]);
        setError(null);
        return pipelineRun;
      } else {
        throw new Error("Failed to execute pipeline");
      }
    } catch (err) {
      setError("Failed to execute pipeline");
      console.error("Error executing pipeline:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch pipeline runs
  const fetchPipelineRuns = async (pipelineId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/pipelines/pipelines/${pipelineId}/runs`
      );
      if (response.ok) {
        const data = await response.json();
        setPipelineRuns((prev) => {
          const filtered = prev.filter((run) => run.pipeline_id !== pipelineId);
          return [...filtered, ...data];
        });
      }
    } catch (err) {
      console.error("Error fetching pipeline runs:", err);
    }
  };

  useEffect(() => {
    fetchPipelines();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "running":
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Pipeline Management
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={createSamplePipeline}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Sample Pipeline
          </button>
          <button
            onClick={fetchPipelines}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Pipelines List */}
      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">Pipelines</h3>
        {pipelines.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No pipelines created yet. Create a sample pipeline to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {pipelines.map((pipeline) => (
              <div
                key={pipeline.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {pipeline.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {pipeline.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    Created: {new Date(pipeline.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => executePipeline(pipeline.id)}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Execute
                  </button>
                  <button
                    onClick={() => fetchPipelineRuns(pipeline.id)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    View Runs
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pipeline Runs */}
      {pipelineRuns.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-md font-medium text-gray-900">Pipeline Runs</h3>
          <div className="space-y-3">
            {pipelineRuns.map((run) => (
              <div
                key={run.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(run.status)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Pipeline Run #{run.id}
                    </p>
                    <p className="text-xs text-gray-500">
                      Pipeline ID: {run.pipeline_id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      run.status
                    )}`}
                  >
                    {run.status}
                  </span>
                  {run.started_at && (
                    <span className="text-xs text-gray-500">
                      Started: {new Date(run.started_at).toLocaleString()}
                    </span>
                  )}
                  {run.completed_at && (
                    <span className="text-xs text-gray-500">
                      Completed: {new Date(run.completed_at).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PipelineManager;

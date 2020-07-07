package com.arsylk.mammonsmite.DestinyChild;

import android.annotation.SuppressLint;
import android.widget.TextView;
import android.widget.Toast;
import com.arsylk.mammonsmite.Live2D.L2DModel;
import com.arsylk.mammonsmite.utils.Utils;
import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileFilter;
import java.io.FilenameFilter;
import java.nio.charset.Charset;
import java.util.*;
import android.util.Log;

public class DCSwapper {
    public class Problem {
        public File fromFile, toFile;
        public boolean important;
        public Problem(File fromFile, File toFile, boolean important) {
            this.fromFile = fromFile;
            this.toFile = toFile;
            this.important = important;
        }
    }
    public class Action {
        public boolean add;
        public String target, value;
        public Action(String target, String value, boolean add) {
            this.target = target;
            this.value = value;
            this.add = add;
        }
    }
    private L2DModel fromL2D, toL2D;
    private LinkedHashMap<File, File> matches = null;
    private List<Problem> problems = null;
    private List<Action> actions = null;
    private File lastFolder = null;

    private TextView output = null;
    private String line;

    //constructors
    public DCSwapper(L2DModel from, L2DModel to) {
        this.fromL2D = from;
        this.toL2D = to;
    }

    //methods
    public void setOutputView(TextView output) {
        output.setText("");
        this.output = output;
    }

    public void matchFiles() {
        line = String.format("[%s] -> [%s]", fromL2D.getModelName(), toL2D.getModelName());
        Log.d("DCTools", line);
        if(output != null) output.append(line+"\n");

        //store matches & problems
        matches = new LinkedHashMap<>();
        problems = new ArrayList<>();
        actions = new ArrayList<>();

        //check textures
        boolean matchingTextures = (fromL2D.getTextures().length == toL2D.getTextures().length);

        //iter slots
        line = "\n------------------------  files  ------------------------";
        Log.d("DCTools", line);
        if(output != null) output.append(line+"\n");
        for(File fileSlot : matchingTextures ? listFiles(toL2D) : listFilesIgnoreTextures(toL2D)) {
            //direct & replace idx match
            File fromMatch = new File(fromL2D.getOutput(), fileSlot.getName().replace(toL2D.getModelId(), fromL2D.getModelId()));
            if(fromMatch.exists()) {
                String stringFrom = String.format("%s/%s", fromL2D.getOutput().getName(), fromMatch.getName());
                String stringTo = String.format("%s/%s", "swap", fileSlot.getName());
                line = String.format("(%s) -> (%s)", stringFrom, stringTo);
                Log.d("DCTools", line);
                if(output != null) output.append(line+"\n");

                matches.put(fromMatch, fileSlot);
            }else {
                problems.add(new Problem(null, fileSlot, false));
            }
        }

        //not matching textures
        if(!matchingTextures) {
            line = "\n------------------------  textures  ------------------------";
            Log.d("DCTools", line);
            if(output != null) output.append(line+"\n");
            //more => less
            for(int i = 0; i < fromL2D.getTextures().length; i++) {
                //texture slots available
                if(i < toL2D.getTextures().length) {
                    String stringFrom = String.format("%s/%s", fromL2D.getOutput().getName(), fromL2D.getTextures()[i].getName());
                    String stringTo = String.format("%s/%s", "swap", toL2D.getTextures()[i].getName());
                    line = String.format("(%s) => (%s)", stringFrom, stringTo);
                    Log.d("DCTools", line);
                    if(output != null) output.append(line+"\n");

                    matches.put(fromL2D.getTextures()[i], toL2D.getTextures()[i]);
                }else {
                    problems.add(new Problem(fromL2D.getTextures()[i], null, true));
                }
            }
            //less => more
            for(int i = fromL2D.getTextures().length; i < toL2D.getTextures().length; i++) {
                //texture slots available
                if(i < fromL2D.getTextures().length) {
                    String stringFrom = String.format("%s/%s", fromL2D.getOutput().getName(), fromL2D.getTextures()[i].getName());
                    String stringTo = String.format("%s/%s", "swap", toL2D.getTextures()[i].getName());
                    line = String.format("(%s) => (%s)", stringFrom, stringTo);
                    Log.d("DCTools", line);
                    if(output != null) output.append(line+"\n");

                    matches.put(fromL2D.getTextures()[i], toL2D.getTextures()[i]);
                }else {
                    problems.add(new Problem(null, toL2D.getTextures()[i], true));
                }
            }
        }

        //auto-resolve problems
        line = "\n------------------------  resolved  ------------------------";
        Log.d("DCTools", line);
        if(output != null) output.append(line+"\n");
        for(Problem problem : new ArrayList<>(problems)) {
            //copy to file
            if(!problem.important && problem.fromFile == null && problem.toFile != null) {
                String stringFrom = String.format("%s/%s", problem.toFile.getParentFile().getName(), problem.toFile.getName());
                String stringTo = String.format("%s/%s", "swap", problem.toFile.getName());
                line = String.format("(%s)  -> (%s)", stringFrom, stringTo);
                Log.d("DCTools", line);
                if(output != null) output.append(line+"\n");

                //remove problem & add match
                problems.remove(problem);
                matches.put(problem.toFile, problem.toFile);
            }
            //replace file with texture
            else if(problem.important && problem.fromFile != null && problem.toFile == null) {
                File unimportant = getMostUnimportantFile(toL2D);
                if(unimportant != null) {
                    String stringFrom = String.format("%s/%s", problem.fromFile.getParentFile().getName(), problem.fromFile.getName());
                    String stringTo = String.format("%s/%s", "swap", unimportant.getName());
                    line = String.format("(%s)  => (%s)", stringFrom, stringTo);
                    Log.d("DCTools", line);
                    if(output != null) output.append(line+"\n");

                    //load texture instead
                    problems.remove(problem);
                    String target = null;
                    if(isExpressionFile(toL2D, unimportant)) {
                        target = "expression";
                    }else if(isMotionFile(toL2D, unimportant)) {
                        target = "motion";
                    }
                    actions.add(new Action(target, unimportant.getName(), false));
                    actions.add(new Action("textures", unimportant.getName(), true));
                    matches.put(problem.fromFile, unimportant);
                }
            }
            //ignore file with texture
            else if(problem.important && problem.fromFile == null && problem.toFile != null) {
                String stringFrom = String.format("%s/%s", problem.toFile.getParentFile().getName(), problem.toFile.getName());
                String stringTo = String.format("%s/%s", "swap", problem.toFile.getName());
                line = String.format("(%s)  -> (%s)", stringFrom, stringTo);
                Log.d("DCTools", line);
                if(output != null) output.append(line+"\n");

                problems.remove(problem);
                actions.add(new Action("textures", problem.toFile.getName(), false));
                matches.put(problem.toFile, problem.toFile);
            }
        }

        //iter unmatched
        if(!problems.isEmpty()) {
            line = "\n------------------------  unmatched  ------------------------";
            Log.d("DCTools", line);
            if(output != null) output.append(line+"\n");
            for(Problem problem : problems) {
                String stringFrom = "???";
                if(problem.fromFile != null)
                    stringFrom = String.format("%s/%s", problem.fromFile.getParentFile().getName(), problem.fromFile.getName());
                String stringTo = "???";
                if(problem.toFile != null)
                    stringTo = String.format("%s/%s", "swap", problem.toFile.getName());
                line = String.format("(%s) %s> (%s)", stringFrom, problem.important ? "=" : "-", stringTo);
                Log.d("DCTools", line);
                if(output != null) output.append(line+"\n");
            }
        }

        //iter actions taken
        if(!actions.isEmpty()) {
            line = "\n------------------------  actions  ------------------------";
            Log.d("DCTools", line);
            if(output != null) output.append(line+"\n");
            for(Action action : actions) {
                line = (action.add ? "add" : "remove")+" "+action.target+" "+action.value;
                Log.d("DCTools", line);
                if(output != null) output.append(line+"\n");
            }
        }

    }

    @SuppressLint("NewApi")
    public boolean swapModels(File swapOutput) {
        if(matches == null || problems == null) return false;
        if(!problems.isEmpty() && output != null) {
            Toast.makeText(output.getContext(), "Swapping with errors!", Toast.LENGTH_SHORT).show();
        }

        //init swap
        try {
            //prepare swap directories
            FileUtils.forceMkdir(swapOutput);

            //copy model header & files
            FileUtils.copyFileToDirectory(toL2D.getModelHeader(), swapOutput);
            for(Map.Entry<File, File> match : matches.entrySet()) {
                FileUtils.copyFile(match.getKey(), new File(swapOutput, match.getValue().getName()));
            }

            //update model info
            File swapModelInfo = new File(swapOutput, "model.json");
            JSONObject modelInfoJson = Utils.fileToJson(toL2D.getModel());
            for(Action action : actions) {
                //target textures action
                if(action.target.equalsIgnoreCase("textures")) {
                    JSONArray textures = modelInfoJson.getJSONArray(action.target);
                    //add value
                    if(action.add) {
                        textures.put(action.value);

                        //if its a motion change file
                        if(modelInfoJson.has("motions")) {
                            JSONObject motions = modelInfoJson.getJSONObject("motions");
                            Iterator<String> keysIterator = motions.keys();
                            while(keysIterator.hasNext()) {
                                String key = keysIterator.next();
                                JSONObject motion = motions.getJSONArray(key).getJSONObject(0);
                                if(motion.getString("file").equalsIgnoreCase(action.value)) {
                                    modelInfoJson.getJSONObject("motions")
                                            .getJSONArray(key).getJSONObject(0)
                                            .put("file", toL2D.getModelId()+"_idle.mtn");
                                }
                            }
                        }
                    //remove last
                    }else {
                        textures.remove(textures.length()-1);
                    }
                }
            }
            String modelInfoContent = modelInfoJson.toString(4).replaceAll(fromL2D.getModelId(), toL2D.getModelId());

            //update model config
            File swapModelConfig = new File(swapOutput, "_model");
            JSONObject modelConfigJson = new JSONObject();
            modelConfigJson.put("model_id", toL2D.getModelId());
            modelConfigJson.put("model_name", fromL2D.getModelName().trim()+" ~> "+toL2D.getModelName().trim());
            modelConfigJson.put("model_info", DCModelInfo.getInstance().getModelInfo(fromL2D.getModelId()));
            String modelConfigContent = modelConfigJson.toString(4);

            //save model info
            FileUtils.write(swapModelInfo, modelInfoContent, Charset.forName("utf-8"));

            //save model config
            FileUtils.write(swapModelConfig, modelConfigContent, Charset.forName("utf-8"));

        }catch(Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public File getLastSwapFolder() {
        return lastFolder;
    }

    //static methods
    public static List<File> listFiles(L2DModel model) {
        File[] files = model.getOutput().listFiles(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String name) {
                return !name.startsWith("_");
            }
        });
        List<File> listFiles = new ArrayList<>();
        Collections.addAll(listFiles, files);
        Collections.sort(listFiles, new Comparator<File>() {
            @Override
            public int compare(File o1, File o2) {
                if(o1.getName().contains(".") && o1.getName().contains("."))
                    return o1.getName().substring(o1.getName().lastIndexOf(".")).compareTo(o2.getName().substring(o2.getName().lastIndexOf(".")));
                return o1.getName().compareTo(o2.getName());
            }
        });
        return listFiles;
    }

    public static List<File> listFilesIgnoreTextures(final L2DModel model) {
        File[] files = model.getOutput().listFiles(new FileFilter() {
            @Override
            public boolean accept(File file) {
                boolean isTexture = false;
                for(File texture : model.getTextures())
                    if(file.equals(texture))
                        isTexture = true;

                return !file.getName().startsWith("_") && !isTexture;
            }
        });
        List<File> listFiles = new ArrayList<>();
        Collections.addAll(listFiles, files);
        Collections.sort(listFiles, new Comparator<File>() {
            @Override
            public int compare(File o1, File o2) {
                if(o1.getName().contains(".") && o1.getName().contains("."))
                    return o1.getName().substring(o1.getName().lastIndexOf(".")).compareTo(o2.getName().substring(o2.getName().lastIndexOf(".")));
                return o1.getName().compareTo(o2.getName());
            }
        });
        return listFiles;
    }

    public static File getMostUnimportantFile(L2DModel model) {
        for(File expressionFile : model.getExpressions())
            return expressionFile;
        if(model.getMotion("hit") != null)
            return model.getMotion("hit");
        if(model.getMotion("banner") != null)
            return model.getMotion("banner");
        for(File motionFile : model.getMotions())
            if(!motionFile.equals(model.getMotion("idle")))
                return motionFile;
        return null;
    }

    public static boolean isExpressionFile(L2DModel model, File file) {
        for(File expression : model.getExpressions())
            if(file.equals(expression))
                return true;
        return false;
    }

    public static boolean isMotionFile(L2DModel model, File file) {
        for(File motion : model.getMotions())
            if(file.equals(motion))
                return true;
        return false;
    }
}

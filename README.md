# AgentMed: Evaluating GPT-5 AI Agents in Medicine

## Overview


**Motivation**: We developed an open-ended benchmark to evaluate GPT-5 series models(from base to reasoning, web, and agentic variants) on real-world multimodal diagnostic tasks, with transparent judging criteria.
 
**Dataset**: A custom diagnostic dataset of 161 multimodal cases (from MedXpertQA), covering 5 body systems. Each case includes a unique ID, an open-ended diagnostic question, medical images (CT, MRI, X-ray, PET, pathology, EEG/ECG, charts, and photos), and a clinically validated ground truth.
 
**Evaluation**: Model performance is assessed across diagnostic accuracy, reasoning quality, web retrieval ability and its influence on domain-relevant evidence, per-body-system variation, reliability across capability upgrades, and the impact of low-quality prompts.
 
**Key findings**: Reasoning models achieve the highest human-adjudicated accuracy (ChatGPT Pro about 0.46%) but remain below clinical adequacy. Web retrieval offers effective evidence but provides minimal insights and sometimes reduces accuracy. Evidence-integration failures dominate reasoning errors. Agentic configurations with planning and tool use underperformed model-only baselines and obscured reasoning transparency. Also, multimodal input quality is essential. Overall, LLMs can help support rather than replace clinical judgment.
 
**Contribution**: We introduce an open-ended judging criteria and scoring protocol that maps model outputs to reference diagnoses (allowing synonyms, subtypes, and near matches). Evaluation comprises both expert adjudication (human judging) and a scalable machine-judging procedure for large-scale judgement(GPT-5 Judge, kappa = 0.63 vs clinicians). Based on human evaluation, we analyze the effects of retrieval, body-system variation, multimodal input quality, and agentic planning on diagnostic accuracy and reasoning quality.

## Main Page
https://JiarongQian.github.io/AgentMed

## Authors

- **Shaohui Zhang** - University of Pennsylvania
- **Jiarong Qian** -
- **Kai Zhang** - Lehigh University
- **Zhiling Yan** - Lehigh University


**Affiliations:** Lehigh University, University of Pennsylvania,University of Florida, Mayo Clinic, Harvard Medical School, Massachusetts General Hospital, Stanford University

## Introduction

Clinical diagnosis is inherently multimodal. Clinicians integrate imaging (e.g., radiology, pathology), physiologic signals and laboratory values with patient history and examination to reach an open-ended conclusion. Early deployments of large-scale foundation models in medicine were largely text-only, useful for evidence summarization, retrieval, and exam-style QA, but limited in supporting the step-wise, uncertainty-aware reasoning required by diagnostic practice. As reasoning-oriented models emerged, they began to externalize intermediate thinking (e.g., iterative deliberation or tool-augmented reasoning). The field has since progressed toward multimodal systems that jointly process images and text, and toward agentic configurations that can plan multi-step procedures, call tools, retrieve evidence, and self-check.

Within this trajectory, GPT-5 exposes multiple modes beyond a single backbone, including Auto routing, compact and high-capacity reasoning variants (Thinking mini, Thinking, Pro), retrieval-augmented settings (Web Search), and agentic configurations (Agent, Deep Research). This diversity raises a central question for medicine: how do different modes, reasoning depth, retrieval, and agent behavior, shape performance and reasoning quality when the task is multimodal diagnosis rather than generic visual question answering.

Benchmarks have evolved alongside models, from multiple-choice exams to resources that incorporate images and, in some cases, structured context. However, prevailing protocols still emphasize short-answer or closed-ended formats and often depend on automatic graders whose agreement with clinicians is insufficiently established.
As a result, current scores provide limited visibility into whether models or systems can synthesize images and patient context into a defensible, open-ended diagnosis.


To bridge these gaps, we study ten GPT-5 configurations (details in Methods) on 161 curated, clinically grounded cases across diverse body systems, each requiring multimodal evidence integration. We introduce an open-ended judging criteria and scoring protocol that maps model outputs to reference diagnoses (allowing synonyms, subtypes, and near matches). Evaluation comprises both expert adjudication (human judging) and a scalable machine-judging procedure for large-scale consistency checks. Based on human evaluation, we analyze the effects of retrieval, body-system variation, multimodal input quality, and agentic planning on diagnostic accuracy and reasoning quality.


Our results indicate that reasoning models achieve the strongest human-adjudicated accuracies yet fell short of clinical adequacy. **Pro** reaches **0.4596**, and its web-augmented counterpart increases only marginally to **0.4658** ($\Delta \approx +0.0062$), whereas adding web search to the **Auto** router *reduces* accuracy by **0.1179** $(p<0.001)$. Retrieval also rarely overturns an incorrect base prediction: when the base model is wrong, the corresponding web configuration is correct in only **10.1-19.1\%** of cases. 

Error profiling indicates that **evidence integration** is the principal bottleneck: ``Evidence-chain'' failures (missing, inconsistent, or circular reasoning steps) dominate, and misinterpretation of visual findings accounts for up to $\sim$ **60\%** of reasoning failures in several models. Notably, agentic configurations that interleave planning, tool use and retrieval do not confer a diagnostic advantage; in our benchmark they underperformed model‑only baselines and obscured their reasoning traces, underscoring the need for transparent and robust evidence integration in multimodal diagnosis.

To scale assessment without sacrificing rigor, a rubric-aligned GPT-5 **machine judge** is $\sim$ **5-10\%** stricter than clinicians yet attains **substantial** overall concordance (mean Cohen’s $\kappa \approx 0.63$, supporting its use as a scalable proxy when paired with expert review. Taken together, these data indicate that **mode choice**, particularly deeper reasoning and disciplined retrieval, governs reliability in open-ended multimodal diagnosis, whereas long agentic traces without robust evidence integration can degrade performance.

## Dataset

Our dataset is derived from **MedXpertQA**, a publicly available benchmark for Human Health tasks. Our dataset was curated through **physician review and selection**, comprising 161 diagnosis cases spanning 5 body systems:

- **Cardiovascular**: 40 cases
- **Digestive**: 34 cases  
- **Respiratory**: 34 cases
- **Skeletal**: 31 cases
- **Nervous**: 22 cases


Each case has a unique identifier and an open-ended, reasoning-style diagnostic question paired with medical images spanning CT, MRI, X-ray, PET, pathology images, EEG/ECG recordings, charts, and real-world photographs, together with a clinically validated ground-truth diagnosis.

## Leaderboard

**GPT-5 model family** accuracy on 161 open-ended diagnosis cases (human adjudication):

| Category | Model | Accuracy |
|----------|-------|----------|
| **LLM** | Auto | 0.3850 |
| | Thinking mini | 0.3292 |
| | Thinking | 0.4161 |
| | **Pro** | **0.4596** |
| **Web-Search** | Auto Web Search | 0.2671 |
| | Thinking mini Web Search | 0.3478 |
| | Thinking Web Search | 0.4410 |
| | **Pro Web Search** | **0.4658** |
| **Agent** | ChatGPT Agent | 0.3664 |
| | Deep Research | 0.2981 |

These results highlight the importance of combining deeper reasoning with disciplined retrieval: the `Pro` variants maintain the highest accuracy, web search brings only modest gains, and `Auto` drops by 0.1179 when retrieval is enabled.

## Physician Judge Criteria

We co-designed a six-dimension rubric with clinicians and present it on the website as a matrix. Each diagnosis is adjudicated as **✓ / Δ / ✗** (fully meets / partially meets / violates) against the following criteria:

- **Matches clinical evidence**: aligns with history, examination findings, and imaging evidence.
- **Clinical reasoning tolerance**: reasoning must remain professional and coherent; generic reasoning receives Δ, contradictions receive ✗.
- **Correct site / polarity**: specifies the correct anatomical site, laterality, and presence/absence descriptors.
- **On topic (no hallucination)**: avoids fabricating tests or facts; answers must stay focused on the case.
- **Diagnostic granularity tolerance**: accepts interchangeable parent/subtype diagnoses; semantic mismatches receive ✗.
- **Minor / format difference**: allows slight wording or formatting differences without altering medical meaning.

## Examples

The homepage carousels feature four representative groups of case studies to illustrate performance patterns we observed:

- **Case studies on the strengths of LLMs**
- **Misclassification and partial-credit cases**
- **Case studies on the limitations of web search**
- **Case studies on the limitations of agents**

## Model Information

Model versions and test dates for August 2025:

| Model Version | Auto (GPT-5) | Thinking mini | Thinking | Pro | Auto Web Search |
|---------------|--------------|---------------|----------|-----|-----------------|
| Test Date (mm.dd.2025) | 08.09 | 08.30 | 08.09–08.10 | 08.09 | 08.11 |

| Model Version | Thinking mini Web Search | Thinking Web Search | Pro Web Search | Deep Research | Agent |
|---------------|--------------------------|---------------------|----------------|---------------|-------|
| Test Date (mm.dd.2025) | 08.16 | 08.11 | 08.10 | 08.14–08.20 | 08.11–08.13 |

> Note: As of August 9, 2025, `ChatAuto` has been renamed to `ChatGPT-5 Auto`.

## BibTeX

If you use this project in your research, please cite:

```bibtex
@inproceedings{2025_AgentMed,
  title={AgentMed: Evaluating GPT-5 AI Agents in Medicine},
  author={Shaohui Zhang,Jiarong Qian,Zhiling Yan,Kai Zhang,Yonghui Wu,Wei Liu,Quangzheng Li,Xiang Li, Xing Lei, Lifang He,Jing Huang,Lichao Sun},
  booktitle={},
  year={2025},
}
```

## License

This project is for research and educational purposes. Please ensure compliance with relevant data privacy and medical research regulations when using the MedXpertQA dataset.

---

*This benchmark aims to establish a rigorous methodology for tracking progress and guiding the responsible development of AI towards a future of safe and reliable clinical support systems.*
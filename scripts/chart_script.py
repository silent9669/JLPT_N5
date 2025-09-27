import plotly.graph_objects as go
import plotly.express as px
import json

# Data from the provided JSON
data = {
    "days": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    "cumulative_vocabulary": [19, 38, 57, 76, 95, 114, 133, 152, 171, 190, 209, 228, 247, 266, 285, 304, 323, 342, 361, 380, 399, 418, 437, 456, 475, 494, 513, 532, 551, 591],
    "cumulative_kanji": [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 120, 126, 132, 138, 144, 150, 156, 162, 168, 174, 205],
    "cumulative_grammar": [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 80],
    "milestones": [
        {"day": 15, "type": "Midterm Test", "questions": 50},
        {"day": 30, "type": "Final Test", "questions": 75}
    ]
}

# Create the figure
fig = go.Figure()

# Define colors (using the brand colors)
colors = ['#1FB8CD', '#DB4545', '#2E8B57']

# Add cumulative progress lines
fig.add_trace(go.Scatter(
    x=data["days"], 
    y=data["cumulative_vocabulary"],
    mode='lines+markers',
    name='Vocabulary',
    line=dict(color=colors[0], width=3),
    marker=dict(size=4),
    hovertemplate='Day %{x}<br>Vocab: %{y}<extra></extra>'
))

fig.add_trace(go.Scatter(
    x=data["days"], 
    y=data["cumulative_kanji"],
    mode='lines+markers',
    name='Kanji',
    line=dict(color=colors[1], width=3),
    marker=dict(size=4),
    hovertemplate='Day %{x}<br>Kanji: %{y}<extra></extra>'
))

fig.add_trace(go.Scatter(
    x=data["days"], 
    y=data["cumulative_grammar"],
    mode='lines+markers',
    name='Grammar',
    line=dict(color=colors[2], width=3),
    marker=dict(size=4),
    hovertemplate='Day %{x}<br>Grammar: %{y}<extra></extra>'
))

# Add milestone markers
for milestone in data["milestones"]:
    day = milestone["day"]
    test_type = milestone["type"]
    questions = milestone["questions"]
    
    # Get the y-values for this day to position the marker
    vocab_val = data["cumulative_vocabulary"][day-1]
    
    # Add vertical line for milestone
    fig.add_vline(
        x=day, 
        line_dash="dash", 
        line_color="gray", 
        opacity=0.7,
        annotation_text=f"{test_type}<br>{questions} questions",
        annotation_position="top"
    )

# Update layout
fig.update_layout(
    title='JLPT N5 30-Day Study Plan Progress',
    xaxis_title='Study Day',
    yaxis_title='Total Items',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5),
    showlegend=True
)

# Update axes
fig.update_xaxes(
    tickmode='linear',
    tick0=5,
    dtick=5,
    range=[1, 30]
)

fig.update_yaxes(
    tickmode='linear',
    dtick=100,
    range=[0, 650]
)

# Update traces for better visibility
fig.update_traces(cliponaxis=False)

# Save the chart as both PNG and SVG
fig.write_image("jlpt_study_plan.png")
fig.write_image("jlpt_study_plan.svg", format="svg")

print("Chart saved as jlpt_study_plan.png and jlpt_study_plan.svg")
fig.show()